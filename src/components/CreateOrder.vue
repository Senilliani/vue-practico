<template>
    <div class="create-order-container">
        <h1>Crear Pedido</h1>
        <form @submit.prevent="submitOrder">
            <input type="number" v-model="newOrder.orderNumber" placeholder="Nº Pedido" class="input-style">

            <table class="product-selection-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Agregar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in availableProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>${{ product.price }}</td>
                        <td>
                            <input type="number" v-model="product.quantity" class="input-style" placeholder="Cantidad"
                                min="0">
                        </td>
                        <td>
                            <button type="button" @click="addProductToOrder(product)" class="add-button"
                                :disabled="isProductAdded(product)">Agregar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Productos seleccionados:</h2>
            <ul>
                <li v-for="(item, index) in newOrder.products" :key="index">
                    {{ item.name }} - Cantidad: {{ item.quantity }} - Total: ${{ item.total }}
                    <button type="button" @click="removeProductFromOrder(index)"
                        class="btn-small btn-danger">Eliminar</button>
                </li>
            </ul>
            <p><strong>Pedido Total: ${{ newOrder.total }}</strong></p>
            <button type="submit" class="submit-button">Crear Pedido</button>
        </form>
    </div>
</template>

<script>
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default {
    data() {
        return {
            newOrder: {
                orderNumber: "",
                products: [],
                total: 0,
            },
            availableProducts: [],
        };
    },
    async created() {
        await this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            const querySnapshot = await getDocs(collection(db, "products"));
            this.availableProducts = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    quantity: 0,
                };
            });
        },
        addProductToOrder(selectedProduct) {
            if (selectedProduct.quantity <= 0) {
                alert("La cantidad debe ser mayor a 0");
                return;
            }
            const productTotal = selectedProduct.price * selectedProduct.quantity;
            const productToAdd = {
                ...selectedProduct,
                total: productTotal,
            };
            this.newOrder.products.push(productToAdd);
            this.calculateOrderTotal();
        },
        calculateOrderTotal() {
            this.newOrder.total = this.newOrder.products.reduce((acc, product) => {
                return acc + product.total;
            }, 0);
        },
        isProductAdded(product) {
            return this.newOrder.products.some((item) => item.id === product.id);
        },
        removeProductFromOrder(index) {
            this.newOrder.products.splice(index, 1);
            this.calculateOrderTotal();
        },
        async submitOrder() {
            if (this.newOrder.products.length === 0) {
                alert("Debe seleccionar al menos un producto");
                return;
            }
            await addDoc(collection(db, "orders"), this.newOrder);
            alert("Pedido creado exitosamente");
            this.resetOrderForm();
        },
        resetOrderForm() {
            this.newOrder = {
                orderNumber: "",
                products: [],
                total: 0,
            };
            this.availableProducts.forEach(product => product.quantity = 0);
        },

    }
}
</script>

<style scoped>
.product-selection-table {
    border-collapse: collapse;
}

.product-selection-table th,
.product-selection-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

.product-selection-table input[type="number"] {
    max-width: 80px;
}

.product-selection-table td:nth-child(2),
.product-selection-table td:nth-child(3),
.product-selection-table td:nth-child(4) {
    width: 15%;
}

.input-style {
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.add-button[disabled] {
    cursor: not-allowed;
    background-color: #ccc;
}

.create-order-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

input[type="number"],
input[type="text"] {
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.add-button:hover {
    background-color: #0056b3;
}

.submit-button {
    background-color: #28a745;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    border: 0;
    padding: 10px;
}

.submit-button:hover {
    background-color: #218838;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background-color: #e9ecef;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-small {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-small.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #c82333;
}
</style>