<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="title">Sign In to an Account</h1>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <input 
            type="email" 
            placeholder="Email" 
            v-model.trim="email"
            class="input-field"
            :disabled="isLoading"
            required
          />
        </div>
        <div class="form-group">
          <input 
            type="password" 
            placeholder="Password" 
            v-model.trim="password"
            class="input-field"
            :disabled="isLoading"
            required
            minlength="6"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="button-group">
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
          <button 
            type="button"
            @click="handleGoogleSignIn" 
            class="google-btn"
            :disabled="isLoading"
          >
            <span v-if="isGoogleLoading">Connecting...</span>
            <span v-else>Sign In With Google</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const isGoogleLoading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    errorMessage.value = "";
    
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.value, 
      password.value
    );
    
    console.log("Successfully signed in!", userCredential.user);
    router.push('/feed');
  } catch (error) {
    console.error("Sign in error:", error);
    
    switch(error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Please enter a valid email address";
        break;
      case "auth/user-not-found":
        errorMessage.value = "No account found with this email";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Incorrect password";
        break;
      case "auth/too-many-requests":
        errorMessage.value = "Too many attempts. Please try again later";
        break;
      default:
        errorMessage.value = "Failed to sign in. Please try again";
    }
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  if (isGoogleLoading.value) return;
  
  try {
    isGoogleLoading.value = true;
    errorMessage.value = "";
    
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    console.log("Google sign in successful!", result.user);
    router.push('/feed');
  } catch (error) {
    console.error("Google sign in error:", error);
    errorMessage.value = "Failed to sign in with Google. Please try again";
  } finally {
    isGoogleLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.register-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.title {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #4a90e2;
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn, .google-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background-color: #357abd;
}

.google-btn {
  background-color: #fff;
  color: #757575;
  border: 1px solid #ddd;
}

.google-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.submit-btn:disabled, .google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>