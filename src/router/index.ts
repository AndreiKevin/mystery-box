import { route } from 'quasar/wrappers';
import {
	// createMemoryHistory,
	createRouter,
	// createWebHashHistory,
	createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from '@/stores/auth';

export default route(() => {
	// const createHistory = process.env.SERVER
	// 	? createMemoryHistory
	// 	: process.env.VUE_ROUTER_MODE === 'history'
	// 		? createWebHistory
	// 		: createWebHashHistory;

	const router = createRouter({
		history: createWebHistory(),
		scrollBehavior: () => ({ left: 0, top: 0 }),
		routes,
	});

	router.beforeEach((to, from, next) => {
		const authStore = useAuthStore();
		const isAuthenticated = authStore.isAuthenticated;

		if (to.meta.requiresAuth && !isAuthenticated) {
			next('/login');
		} else if (to.meta.guest && isAuthenticated) {
			next('/marketplace');
		} else {
			next();
		}
	});

	return router;
});
