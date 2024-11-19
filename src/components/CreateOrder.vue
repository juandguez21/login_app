<template>
    <div class="create-order-container">
        <h1>Create New Order</h1>

        <form @submit.prevent="submitOrder">
            <input 
                v-model.trim="newOrder.orderNumber" 
                placeholder="Order Number" 
                class="input-field"
                required
            >
            
            <table class="product-selection-table">
               <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Add</th>
                    </tr>
               </thead> 
               <tbody>
                    <tr v-for="product in availableProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>${{ product.price.toFixed(2) }}</td>
                        <td>
                            <input 
                                type="number" 
                                v-model.number="product.quantity" 
                                min="0"
                                placeholder="Quantity" 
                                class="input-field"
                            >
                        </td>
                        <td>
                            <button 
                                type="button" 
                                @click="addProductToOrder(product)" 
                                class="btn-small btn-add" 
                                :disabled="isProductAdded(product)"
                            >
                                Add
                            </button>
                        </td>
                    </tr>
               </tbody>
            </table>

            <div v-if="newOrder.products.length > 0">
                <h2>Selected Products:</h2> 
                <ul>
                    <li v-for="(item, index) in newOrder.products" :key="item.id + '-' + index">
                        {{ item.name }} - Quantity: {{ item.quantity }} - Total: ${{ item.total.toFixed(2) }}
                        <button 
                            type="button"
                            @click="removeProductFromOrder(index)" 
                            class="btn-small btn-remove"
                        >
                            Remove
                        </button>
                    </li>
                </ul>
                <p><strong>Order Total: ${{ newOrder.total.toFixed(2) }}</strong></p>
            </div>
            
            <button 
                type="submit" 
                class="btn-submit"
                :disabled="!isFormValid"
            >
                Submit Order
            </button>
        </form>
    </div>
</template>

<script>
import { db } from '../main';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default {
    name: 'CreateOrder',
    data() {
        return {
            newOrder: {
                orderNumber: '',
                products: [],
                total: 0,
                createdAt: null
            },
            availableProducts: [],
            isSubmitting: false
        };
    },
    computed: {
        isFormValid() {
            return this.newOrder.orderNumber.trim() && 
                   this.newOrder.products.length > 0 &&
                   !this.isSubmitting;
        }
    },
    async created() {
        try {
            await this.fetchProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error loading products. Please try again.');
        }
    },
    methods: {
        async fetchProducts() {
            const querySnapshot = await getDocs(collection(db, "products"));
            this.availableProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                quantity: 0
            }));
        },
        addProductToOrder(selectedProduct) {
            if (selectedProduct.quantity <= 0) {
                alert('Please add a valid quantity');
                return;
            }
            
            const productTotal = Number((selectedProduct.price * selectedProduct.quantity).toFixed(2));
            const productToAdd = {
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: selectedProduct.quantity,
                total: productTotal
            };
            
            this.newOrder.products.push(productToAdd);
            this.calculateOrderTotal();
            selectedProduct.quantity = 0; // Reset quantity after adding
        },
        calculateOrderTotal() {
            this.newOrder.total = Number(
                this.newOrder.products.reduce((acc, product) => acc + product.total, 0).toFixed(2)
            );
        },
        isProductAdded(product) {
            return this.newOrder.products.some(item => item.id === product.id);
        },
        removeProductFromOrder(index) {
            this.newOrder.products.splice(index, 1);
            this.calculateOrderTotal();
        },
        async submitOrder() {
            if (!this.isFormValid) {
                alert("Please fill all required fields and add at least one product.");
                return;
            }

            try {
                this.isSubmitting = true;
                const orderData = {
                    ...this.newOrder,
                    createdAt: new Date().toISOString()
                };
                
                await addDoc(collection(db, "orders"), orderData);
                alert('Order created successfully');
                this.resetOrderForm();
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Error creating order. Please try again.');
            } finally {
                this.isSubmitting = false;
            }
        },
        resetOrderForm() {
            this.newOrder = {
                orderNumber: '',
                products: [],
                total: 0,
                createdAt: null
            };
            this.availableProducts.forEach(product => product.quantity = 0);
        }
    }
}
</script>
<style scoped>
.create-order-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.title {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.subtitle {
    color: #2c3e50;
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
}

.order-form {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
}

.input-field {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.input-field:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.table-container {
    margin: 2rem 0;
    overflow-x: auto;
}

.product-selection-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.product-selection-table th,
.product-selection-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.product-selection-table th {
    background-color: #f4f4f4;
}

.quantity-input {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
}

.btn-small{
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #2196F3;
    color: white;
}

.btn-add {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.btn-add:hover:not(:disabled) {
    background: #3182ce;
}

.btn-remove {
    background: #f44336;
    color: white;
    padding: 0.25rem 0.5rem;
}

.btn-remove:hover {
    background: #f56565;
}


.btn-submit {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.btn-submit:hover:not(:disabled) {
    background: #38a169;
}

.btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.products-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}

.product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: #f7fafc;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.product-item:hover {
    background: #edf2f7;
}

.product-info {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.product-name {
    font-weight: 500;
    min-width: 200px;
}

.product-quantity {
    color: #4CAF50;
}

.product-total {
    color: #2d3748;
    font-weight: 500;
}

.order-total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #e2e8f0;
    font-size: 1.25rem;
}

.order-total strong {
    color: #2d3748;
    font-size: 1.5rem;
}
</style>