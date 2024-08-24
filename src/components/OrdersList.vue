<template>
    <div class="orders-list-container">
        <h1>Pedidos</h1>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Nº Pedido</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.orderNumber }}</td>
                    <td>${{ order.total }}</td>
                    <td>
                        <button class="btn-small btn-danger" @click="deleteOrder(order.id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <router-link to="/create-order" class="add-order-link">Agregar nuevo pedido</router-link>
    </div>
</template>

<script>
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default {
    data() {
        return {
            orders: [],
        };
    },
    async created() {
        await this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            const querySnapshot = await getDocs(collection(db, "orders"));
            this.orders = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
        },
        async deleteOrder(id) {
            await deleteDoc(doc(db, "orders", id));
            await this.fetchOrders();
        },
        async editOrder(id) {
            this.$router.push(`/edit-order/${id}`);
        },
    },
};
</script>

<style scoped>
.orders-list-container {
    margin: auto;
    max-width: 800px;
    padding: 20px;
}

.orders-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.orders-table th,
.orders-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

.orders-table th {
    background-color: #f5f5f5;
}

.btn-small:hover,
.btn-small.btn-danger:hover {
    opacity: 0.8;
}

.add-order-link {
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    color: white;
    border-radius: 4px;
    background-color: #007bff;
}

.add-order-link:hover {
    background-color: #0056b3;
}
</style>