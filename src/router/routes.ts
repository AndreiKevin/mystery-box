import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("@/components/layout/MainLayout.vue"),
		children: [
			{
				path: "",
				redirect: "/marketplace",
			},
			{
				path: "marketplace",
				name: "Marketplace",
				component: () => import("@/pages/Marketplace.vue"),
				meta: { requiresAuth: true },
			},
			// Add other authenticated routes here
			/**
			 *  a route a child of another route has specific implications:
				Child routes are rendered inside their parent component's <router-view> element.
				They inherit the path of their parent (so "marketplace" becomes "/marketplace").
				They share the parent's component (in this case, MainLayout.vue).
			 */
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
	{
		path: '/poloniex-feed',
		name: 'PoloniexFeed',
		component: () => import("@/pages/PoloniexFeed.vue"),
	},
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
