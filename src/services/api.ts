import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const authStore = useAuthStore();
		if (authStore.token) {
			config.headers.Authorization = `Bearer ${authStore.token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

api.interceptors.response.use(
	(response) => response.data,
	(error: AxiosError) => {
		const router = useRouter();
		const authStore = useAuthStore();

		if (error.response?.status === 401) {
			authStore.logout();
			router.push("/login");
		}

		return Promise.reject(
			new Error(
				error.response?.data?.error?.message || "An unexpected error occurred",
			),
		);
	},
);
