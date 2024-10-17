import axios, { type AxiosInstance, type AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// before request is sent, add the auth token to the request if it exists
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

// before response is returned, check if the response is a 401
// if so, logout and redirect to login
api.interceptors.response.use(
	(response) => response.data,
	(error: AxiosError) => {
		const router = useRouter();
		const authStore = useAuthStore();

		if (error.response?.status === 401) {
			authStore.logout();
			router.push("/login");
		}

		const responseData = error?.response?.data as { message?: string; error?: { message?: string } };
		const errorMessage = responseData?.message ?? responseData?.error?.message ?? "An unexpected error occurred";

		return Promise.reject(new Error(errorMessage));
	},
);
