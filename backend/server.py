from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (with fallback)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'prokritir')
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
db = client[db_name]
IN_MEMORY_ORDERS = {}

app = FastAPI(title="Prokritir Jol API")
api_router = APIRouter(prefix="/api")


# ─────────────────────────────  PRODUCT CATALOG  ─────────────────────────────
PRODUCTS = [
    # Water (Prokritir Jol)
    {"sku": "PJ-500-1",  "name": "Prokritir Jol 500 ml",       "size": "500 ml",   "pack": 1,   "price": 20,  "label": "Single Bottle", "category": "water"},
    {"sku": "PJ-500-12", "name": "Prokritir Jol 500 ml x 12",  "size": "500 ml",   "pack": 12,  "price": 200, "label": "12-Pack Case", "category": "water"},
    {"sku": "PJ-500-24", "name": "Prokritir Jol 500 ml x 24",  "size": "500 ml",   "pack": 24,  "price": 380, "label": "24-Pack Case", "category": "water"},
    {"sku": "PJ-1L-1",   "name": "Prokritir Jol 1 L",          "size": "1 L",      "pack": 1,   "price": 40,  "label": "Single Bottle", "category": "water"},
    {"sku": "PJ-1L-12",  "name": "Prokritir Jol 1 L x 12",     "size": "1 L",      "pack": 12,  "price": 400, "label": "12-Pack Case", "category": "water"},
    {"sku": "PJ-1L-24",  "name": "Prokritir Jol 1 L x 24",     "size": "1 L",      "pack": 24,  "price": 760, "label": "24-Pack Case", "category": "water"},

    # Spices (Prokritir Masala)
    {"sku": "PM-TRIO",     "name": "Prokritir Masala Trio Combo", "size": "Trio Pack", "pack": 1, "price": 199, "label": "Turmeric + Chili + Cumin (100g each)", "category": "masala"},
    {"sku": "PM-TURM-250",  "name": "Prokritir Turmeric (হলুদ)",   "size": "250 g",     "pack": 1, "price": 75,  "label": "Pure Turmeric Powder", "category": "masala"},
    {"sku": "PM-CHILI-250", "name": "Prokritir Red Chili (লঙ্কা)",  "size": "250 g",     "pack": 1, "price": 95,  "label": "Spicy Red Chili Powder", "category": "masala"},
    {"sku": "PM-CUMIN-250", "name": "Prokritir Cumin (জিরে)",     "size": "250 g",     "pack": 1, "price": 120, "label": "Roasted Cumin Powder", "category": "masala"},

    # Tea (Prokritir Chai)
    {"sku": "PC-CTC-250",   "name": "Prokritir CTC Chai (সিটিসি)", "size": "250 g",     "pack": 1, "price": 110, "label": "Premium Assam CTC Blend", "category": "chai"},
    {"sku": "PC-ORTH-250",  "name": "Prokritir Darjeeling Leaf",   "size": "250 g",     "pack": 1, "price": 240, "label": "Pure Orthodox Darjeeling", "category": "chai"},
    {"sku": "PC-MASALA-250", "name": "Prokritir Spiced Chai (মশলা)","size": "250 g",     "pack": 1, "price": 165, "label": "Traditional Spiced Tea Blend", "category": "chai"},
]
PRODUCT_BY_SKU = {p["sku"]: p for p in PRODUCTS}


# ─────────────────────────────  MODELS  ─────────────────────────────
class LineItem(BaseModel):
    sku: str
    quantity: int = Field(ge=1, le=99)


class Customer(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    address_line: str = Field(min_length=4, max_length=200)
    city: str = Field(min_length=2, max_length=80)
    state: str = Field(min_length=2, max_length=80)
    pincode: str = Field(min_length=4, max_length=12)
    notes: Optional[str] = Field(default=None, max_length=500)


class OrderCreate(BaseModel):
    items: List[LineItem] = Field(min_length=1, max_length=20)
    customer: Customer


class OrderItem(BaseModel):
    sku: str
    name: str
    size: str
    pack: int
    quantity: int
    unit_price: int
    line_total: int


class Order(BaseModel):
    id: str
    order_number: str
    items: List[OrderItem]
    subtotal: int
    shipping: int
    total: int
    customer: Customer
    status: str
    created_at: str
    # Where the order is actually completed. The site only captures the basket;
    # confirmation, payment and shipment updates all happen in the WhatsApp
    # thread the customer is sent to, keyed by `order_number`.
    # Defaulted so orders written before the WhatsApp handoff still load.
    channel: str = "whatsapp"


# ─────────────────────────────  ROUTES  ─────────────────────────────
@api_router.get("/")
async def root():
    return {"service": "Prokritir Jol API", "status": "ok"}


@api_router.get("/products", response_model=List[dict])
async def list_products():
    return PRODUCTS


def _short_order_number(prefix: str = "PJ") -> str:
    # Human-friendly: PJ-YYMMDD-XXXX
    now = datetime.now(timezone.utc)
    suffix = uuid.uuid4().hex[:4].upper()
    return f"{prefix}-{now.strftime('%y%m%d')}-{suffix}"


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    # Resolve line items & compute totals server-side (never trust client prices)
    items: List[OrderItem] = []
    subtotal = 0
    prefix = "PJ"
    for li in payload.items:
        product = PRODUCT_BY_SKU.get(li.sku)
        if not product:
            raise HTTPException(status_code=400, detail=f"Unknown SKU: {li.sku}")
        
        # Resolve order number prefix based on first non-water SKU
        if li.sku.startswith("PM-"):
            prefix = "PM"
        elif li.sku.startswith("PC-"):
            prefix = "PC"
            
        line_total = product["price"] * li.quantity
        subtotal += line_total
        items.append(OrderItem(
            sku=product["sku"],
            name=product["name"],
            size=product["size"],
            pack=product["pack"],
            quantity=li.quantity,
            unit_price=product["price"],
            line_total=line_total,
        ))

    # Free shipping above ₹300; otherwise flat ₹40
    shipping = 0 if subtotal >= 300 else 40
    total = subtotal + shipping

    order_id = str(uuid.uuid4())
    order_number = _short_order_number(prefix)
    created_at = datetime.now(timezone.utc).isoformat()

    order = Order(
        id=order_id,
        order_number=order_number,
        items=items,
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        customer=payload.customer,
        status="placed",
        created_at=created_at,
    )

    doc = order.model_dump()
    IN_MEMORY_ORDERS[order_id] = doc
    try:
        await db.orders.insert_one(doc)
    except Exception as e:
        logger.warning(f"MongoDB save skipped or failed, using in-memory store: {e}")
    return order


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    doc = IN_MEMORY_ORDERS.get(order_id)
    if not doc:
        try:
            doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
        except Exception as e:
            logger.warning(f"MongoDB query failed: {e}")
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**doc)


# ─────────────────────────────  APP WIRING  ─────────────────────────────
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
