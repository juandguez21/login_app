<template>
    <div class="edit-order-container">
        <h1>Edit Order</h1>
        <form @submit.prevent="updateOrder" class="edit-form">
            <div class="form-group">
                <label for="orderNumber">Order Number:</label>
                <input 
                    type="text" 
                    id="orderNumber" 
                    v-model="orderData.orderNumber" 
                    required
                />
            </div>
            
            <div class="form-group">
                <label for="total">Total:</label>
                <input 
                    type="number" 
                    id="total" 
                    v-model="orderData.total" 
                    required
                    step="0.01"
                />
            </div>

            <div class="button-group">
                <button type="submit" class="btn-save">Save Changes</button>
                <button type="button" @click="goBack" class="btn-cancel">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../main';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const orderData = ref({
            orderNumber: '',
            total: 0
        });

        onMounted(async () => {
            const orderId = route.params.id;
            try {
                const orderDoc = await getDoc(doc(db, "orders", orderId));
                if (orderDoc.exists()) {
                    orderData.value = {
                        ...orderDoc.data(),
                        id: orderDoc.id
                    };
                } else {
                    alert('Order not found');
                    router.push('/');
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                alert('Error fetching order details');
                router.push('/');
            }
        });

        const updateOrder = async () => {
            try {
                const orderId = route.params.id;
                await updateDoc(doc(db, "orders", orderId), {
                    orderNumber: orderData.value.orderNumber,
                    total: parseFloat(orderData.value.total)
                });
                alert('Order updated successfully');
                router.push('/');
            } catch (error) {
                console.error("Error updating order:", error);
                alert('Error updating order');
            }
        };

        const goBack = () => {
            router.push('/');
        };

        return {
            orderData,
            updateOrder,
            goBack
        };
    }
};
</script>

<style scoped>
.edit-order-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.edit-form {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.button-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn-save {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-cancel {
    padding: 10px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    opacity: 0.9;
}
</style>