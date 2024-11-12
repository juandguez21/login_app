import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../components/Home.vue")},
        { path: "/register", component: () => import("../components/Register.vue")},
        { path: "/sign-in", component: () => import("../components/SignIn.vue")},
        { path: "/feed", component: () => import("../components/Feed.vue")},
    ],
});

export default router;