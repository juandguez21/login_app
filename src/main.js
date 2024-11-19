import { createApp } from 'vue'
import App from './App.vue'
import router  from './router'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtfpXHdumqPFKGoQOEMKYVWS-77CZC9tM",
  authDomain: "login-52f07.firebaseapp.com",
  projectId: "login-52f07",
  storageBucket: "login-52f07.firebasestorage.app",
  messagingSenderId: "970731196467",
  appId: "1:970731196467:web:2bebb9cf7a6cbcc469d346"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Create Vue application
const app = createApp(App);

app.use(router)
app.mount('#app')

export { db }


