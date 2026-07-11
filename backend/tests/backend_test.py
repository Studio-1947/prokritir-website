"""Backend tests for Prokritir Jol order-capture API"""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://prokritir-jol.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

VALID_CUSTOMER = {
    "name": "Arindam Chatterjee",
    "phone": "+919000000000",
    "email": "arindam@example.com",
    "address_line": "House 12, Ranaghat Rd",
    "city": "Nadia",
    "state": "West Bengal",
    "pincode": "741101",
    "notes": "Ring gate 2",
}

EXPECTED_PRICES = {
    "PJ-500-1": 20,
    "PJ-500-12": 200,
    "PJ-500-24": 380,
    "PJ-1L-1": 40,
    "PJ-1L-12": 400,
    "PJ-1L-24": 760,
}


# ─── Products ────────────────────────────────────────────────────────────────
class TestProducts:
    def test_list_products(self):
        r = requests.get(f"{API}/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6
        skus = {p["sku"]: p for p in data}
        for sku, price in EXPECTED_PRICES.items():
            assert sku in skus, f"Missing SKU {sku}"
            assert skus[sku]["price"] == price, f"Wrong price for {sku}: got {skus[sku]['price']}"
        # Structure checks
        for p in data:
            for k in ("sku", "name", "size", "pack", "price", "label"):
                assert k in p, f"Missing key {k} in product"


# ─── Order creation ─────────────────────────────────────────────────────────
class TestCreateOrder:
    def test_create_order_valid_free_shipping(self):
        payload = {
            "items": [
                {"sku": "PJ-500-12", "quantity": 2},   # 400
                {"sku": "PJ-1L-1", "quantity": 3},     # 120
            ],
            "customer": VALID_CUSTOMER,
        }
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        # id uuid
        assert re.match(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", data["id"])
        # order number pattern
        assert re.match(r"^PJ-\d{6}-[A-Z0-9]{4}$", data["order_number"]), data["order_number"]
        # Totals
        assert data["subtotal"] == 520
        assert data["shipping"] == 0
        assert data["total"] == 520
        assert data["status"] == "placed"
        assert "created_at" in data and "T" in data["created_at"]
        assert len(data["items"]) == 2
        # Persistence check
        order_id = data["id"]
        g = requests.get(f"{API}/orders/{order_id}", timeout=15)
        assert g.status_code == 200
        fetched = g.json()
        assert fetched["id"] == order_id
        assert fetched["subtotal"] == 520
        assert fetched["customer"]["name"] == VALID_CUSTOMER["name"]
        assert fetched["customer"]["pincode"] == VALID_CUSTOMER["pincode"]

    def test_create_order_shipping_below_threshold(self):
        # 5 x ₹20 = ₹100, shipping ₹40, total ₹140
        payload = {
            "items": [{"sku": "PJ-500-1", "quantity": 5}],
            "customer": VALID_CUSTOMER,
        }
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["subtotal"] == 100
        assert data["shipping"] == 40
        assert data["total"] == 140

    def test_create_order_unknown_sku(self):
        payload = {
            "items": [{"sku": "PJ-FAKE-99", "quantity": 1}],
            "customer": VALID_CUSTOMER,
        }
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 400, r.text
        detail = r.json().get("detail", "")
        assert "Unknown SKU" in detail
        assert "PJ-FAKE-99" in detail

    def test_create_order_missing_name(self):
        cust = {**VALID_CUSTOMER}
        cust.pop("name")
        payload = {"items": [{"sku": "PJ-500-1", "quantity": 1}], "customer": cust}
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_create_order_missing_phone(self):
        cust = {**VALID_CUSTOMER}
        cust.pop("phone")
        payload = {"items": [{"sku": "PJ-500-1", "quantity": 1}], "customer": cust}
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 422

    def test_create_order_pincode_too_short(self):
        cust = {**VALID_CUSTOMER, "pincode": "12"}
        payload = {"items": [{"sku": "PJ-500-1", "quantity": 1}], "customer": cust}
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 422

    def test_create_order_empty_items(self):
        payload = {"items": [], "customer": VALID_CUSTOMER}
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 422


# ─── Order retrieval ─────────────────────────────────────────────────────────
class TestGetOrder:
    def test_get_unknown_order_404(self):
        fake_id = "00000000-0000-0000-0000-000000000000"
        r = requests.get(f"{API}/orders/{fake_id}", timeout=15)
        assert r.status_code == 404
        assert r.json().get("detail") == "Order not found"

    def test_full_order_roundtrip(self):
        # Create then GET to verify full persistence of items and customer
        payload = {
            "items": [
                {"sku": "PJ-1L-24", "quantity": 1},
                {"sku": "PJ-500-1", "quantity": 2},
            ],
            "customer": VALID_CUSTOMER,
        }
        r = requests.post(f"{API}/orders", json=payload, timeout=15)
        assert r.status_code == 200
        oid = r.json()["id"]
        g = requests.get(f"{API}/orders/{oid}", timeout=15).json()
        # 760 + 40 = 800; shipping free
        assert g["subtotal"] == 800
        assert g["shipping"] == 0
        assert g["total"] == 800
        assert {i["sku"] for i in g["items"]} == {"PJ-1L-24", "PJ-500-1"}
        for i in g["items"]:
            if i["sku"] == "PJ-1L-24":
                assert i["unit_price"] == 760
                assert i["line_total"] == 760
            if i["sku"] == "PJ-500-1":
                assert i["unit_price"] == 20
                assert i["quantity"] == 2
                assert i["line_total"] == 40
        assert g["customer"]["city"] == VALID_CUSTOMER["city"]
