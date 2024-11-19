<template>
    <div class="order-list-container">
        <h1>Order List</h1>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order Number</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.orderNumber }}</td>
                    <td>{{ order.total }}</td> 
                    <td>
                        <button class="btn-small" @click="editOrder(order.id)">Edit</button>
                        <button class="btn-small btn-danger" @click="deleteOrder(order.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <router-link to="/create-order" class="add-order-link">Add New Order</router-link>
    </div>
</template>

<script>
import { db } from '../main';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router'; // Importamos useRouter

export default {
    data() {
        return {
            orders: [],
        };
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    async created() {
        await this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            const querySnapshot = await getDocs(collection(db, "orders"));
            this.orders = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        },
        async deleteOrder(id) {
            try {
                await deleteDoc(doc(db, "orders", id));
                await this.fetchOrders();
                alert('Order deleted successfully');
            } catch (error) {
                console.error("Error deleting order:", error);
                alert('Error deleting order');
            }
        },
        editOrder(id) {
            this.router.push(`/edit-order/${id}`);
        }
    }
};
</script>

<style scoped>
.order-list-container {
    padding: 20px;
}

.orders-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.orders-table th,
.orders-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.orders-table th {
    background-color: #f4f4f4;
}

.btn-small {
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #2196F3;
    color: white;
}

.btn-danger {
    background-color: #f44336;
}

.add-order-link {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}
</style>