import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API, timeout: 20000 });

export const listProducts = () => client.get("/products").then((r) => r.data);
export const createOrder = (payload) => client.post("/orders", payload).then((r) => r.data);
export const getOrder = (orderId) => client.get(`/orders/${orderId}`).then((r) => r.data);
