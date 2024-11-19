import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../components/Home.vue")},
        { path: "/register", component: () => import("../components/Register.vue")},
        { path: "/sign-in", component: () => import("../components/SignIn.vue")},
        { 
            path: "/products", 
            component: () => import("../components/ProductList.vue"),
            meta: {
                requiresAuth: true,
            },
        },
        { path: "/orders", component: () => import("../components/OrderList.vue"),
            meta: {
                requiresAuth: true,
            },
        },
        { path: "/create-order", component: () => import("../components/CreateOrder.vue"),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path:"/edit-order/:id", component: () => import("../components/EditOrder.vue"),
            meta: {
                requiresAuth: true,
            },
        }
    ],
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const user = await getCurrentUser();
        if (user) {
            next();
        } else {
            alert("you dont have access!");
            next("/sign-in");
        }
    } else {
        next();
    }
});

export default router;