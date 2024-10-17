import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
	User,
	LoginCredentials,
	RegisterData,
	AuthState,
} from "@/types/auth";
import { api } from "@/services/api";
import { useWebSocket } from "@/services/websocket";
import { AxiosError } from 'axios';

export const useAuthStore = defineStore("auth", () => {
	const token = ref<string | null>(localStorage.getItem("token"));
	const user = ref<User | null>(
		JSON.parse(localStorage.getItem("user") || "null"),
	);
	const { connect, disconnect } = useWebSocket();

	const isAuthenticated = computed(() => !!token.value);
	const userCredits = computed(() => user.value?.credits ?? 0);

	async function login(credentials: LoginCredentials): Promise<void> {
		try {
			const response = await api.post<AuthState>("/api/v1/auth/login", credentials);
			setAuth(response.data);
			await connect();
		} catch (error) {
			handleApiError(error);
		}
	}

	async function register(userData: RegisterData): Promise<User> {
		try {
			const response = await api.post<AuthState>("/api/v1/auth/register", userData);
			setAuth(response.data);
			await connect();
			return response.data.user as User;
		} catch (error) {
			handleApiError(error);
			throw error; // Re-throw to allow caller to handle the error
		}
	}

	function logout(): void {
		token.value = null;
		user.value = null;
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		disconnect();
	}

	function updateCredits(amount: number): void {
		if (user.value) {
			user.value.credits += amount;
			localStorage.setItem("user", JSON.stringify(user.value));
		}
	}

	function setAuth(auth: AuthState): void {
		if (auth.token && auth.user) {
			token.value = auth.token;
			user.value = auth.user;
			localStorage.setItem("token", auth.token);
			localStorage.setItem("user", JSON.stringify(auth.user));
		} else {
			console.error("Invalid auth state received");
			logout(); // Clear any existing auth data
		}
	}

	function handleApiError(error: unknown): void {
		if (error instanceof AxiosError) {
			console.error("API Error:", error.response?.data || error.message);
		} else {
			console.error("Unknown error:", error);
		}
		logout(); // Clear any existing auth data on error
	}

	return {
		token,
		user,
		isAuthenticated,
		userCredits,
		login,
		register,
		logout,
		updateCredits,
	};
});
