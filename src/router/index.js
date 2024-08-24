import CreateOrder from "@/components/CreateOrder.vue";
import OrdersList from "@/components/OrdersList.vue";
import ProductList from "@/components/ProductList.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/products", component: ProductList },
  { path: "/orders", component: OrdersList },
  { path: "/create-order", component: CreateOrder },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
