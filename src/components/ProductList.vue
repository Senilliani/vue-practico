<template>
    <div class="product-list-container">
        <h1>Productos</h1>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>${{ product.price }}</td>
                    <td>{{ product.description }}</td>
                    <td>
                        <button class="btn-small" @click="editProduct(product.id)">Editar</button>
                        <button class="btn-small btn-danger" @click="deleteProduct(product.id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="showAddProduct = true">Agregar Producto</button>

        <div v-if="showAddProduct || selectedProduct" class="product-form">
            <input v-model="productForm.name" placeholder="Nombre">
            <input v-model="productForm.price" placeholder="Precio">
            <textarea v-model="productForm.description" placeholder="Descripción"></textarea>

            <button @click="submitProduct">Enviar</button>
            <button @click="cancelProduct">Cancelar</button>
        </div>

    </div>
</template>

<script>
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default {
    data() {
        return {
            products: [],
            showAddProduct: false,
            selectedProduct: null,
            productForm: {
                name: "",
                price: 0,
                description: "",
            },
        };
    },
    async created() {
        await this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            const querySnapshot = await getDocs(collection(db, "products"));
            this.products = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        editProduct(id) {
            const product = this.products.find(product => product.id === id);
            this.productForm = { ...product };
            this.selectedProduct = id;
            this.showAddProduct = true;
        },
        async deleteProduct(id) {
            await deleteDoc(doc(db, "products", id));
            await this.fetchProducts();
        },
        async submitProduct() {
            if (this.selectedProduct) {
                await updateDoc(doc(db, "products", this.selectedProduct), this.productForm);
            } else {
                await addDoc(collection(db, "products"), this.productForm);
            }
            this.cancelProduct();
            await this.fetchProducts();
        },
        cancelProduct() {
            this.showAddProduct = false;
            this.selectedProduct = null;
            this.productForm = { name: "", price: 0, description: "" };
        }
    }
};
</script>

<style scoped>
.product-list-container {
    max-width: 800px;
    margin: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f5f5f5;
}

.btn-small.btn-danger {
    background-color: #dc3545;
}

.btn-small:hover {
    opacity: 0.8;
}

.product-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

.product-form button {
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #28a745;
    color: white;
}

.product-form button:hover {
    background-color: #218838;
}

.product-form input,
.product-form textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>