<template>
    <div class="product-list-container">
        <h1>Product List</h1>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>${{ product.price }}</td>
                    <td>{{ product.description }}</td>
                    <td>
                        <button class="btn-edit" @click="editProduct(product.id)">Edit</button>
                        <button class="btn-danger" @click="deleteProduct(product.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="showAddProduct = true">Add New Product</button>
        
        <div v-if="showAddProduct || selectedProduct" class="product-form">
            <input v-model="productForm.name" placeholder="Name"> 
            <input v-model.number="productForm.price" placeholder="Price" type="number">
            <textarea v-model="productForm.description" placeholder="Description"></textarea> 

            <button @click="submitProduct">Submit</button>
            <button class="button-cancel" @click="cancel">Cancel</button>
        </div>
    </div>
</template>

<script>
import { db } from '../main';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            products: [],
            showAddProduct: false,
            selectedProduct: null,
            productForm: {
                name: '',
                price: 0,
                description: '',
            },
        };
    },
    async created() {
        await this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                this.products = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))  // Added missing parentheses
                    .sort((a, b) => a.name.localeCompare(b.name));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        editProduct(id) {
            const product = this.products.find(product => product.id === id);
            if (product) {
                this.productForm = { ...product };
                this.selectedProduct = id;
                this.showAddProduct = true;
            }
        },
        async deleteProduct(id) {
            try {
                await deleteDoc(doc(db, "products", id));
                await this.fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        },
        async submitProduct() {
            try {
                if (this.selectedProduct) {
                    await updateDoc(doc(db, "products", this.selectedProduct), this.productForm);
                } else {
                    await addDoc(collection(db, "products"), this.productForm);  // Removed extra parameter
                }
                this.cancel();
                await this.fetchProducts();
            } catch (error) {
                console.error("Error submitting product:", error);
            }
        },
        cancel() {
            this.showAddProduct = false;
            this.selectedProduct = null;
            this.productForm = { name: '', price: 0, description: '' };  // Fixed typo in productForm
        }
    }
}
</script>

<style scoped>
.product-list-container {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

.product-form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
}

input, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    margin-right: 8px;
}

.button-cancel {
    background-color: #f44336;

}
.btn-danger {
    background-color: #f44336;
}

.btn-edit {
    background-color: #2196F3;
}
</style>