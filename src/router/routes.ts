import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
	{
		path: "/",
		redirect: "/marketplace",
		component: () => import("@/components/layout/MainLayout.vue"),
		children: [
			{
				path: "marketplace",
				name: "Marketplace",
				component: () => import("@/pages/Marketplace.vue"),
				meta: { requiresAuth: true },
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/pages/Login.vue"),
		meta: { guest: true },
	},
	{
		path: "/register",
		name: "Register",
		component: () => import("@/pages/Register.vue"),
		meta: { guest: true },
	},
];

export default routes;
