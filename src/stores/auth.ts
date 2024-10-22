import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
	User,
	LoginCredentials,
	RegisterData,
	AuthState,
} from "@/types/auth";
import { api, authApi } from "@/services/api";
import { useWebSocket } from "@/services/websocket";
import { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore("auth", () => {
	const router = useRouter();
	const token = ref<string | null>(localStorage.getItem("token"));
	const user = ref<User | null>(
		JSON.parse(localStorage.getItem("user") || "null"),
	);
	const { connect, disconnect } = useWebSocket();

	const isAuthenticated = computed(() => !!token.value);
	const userCredits = computed(() => user.value?.credits ?? 0);

	async function login(credentials: LoginCredentials): Promise<void> {
		try {
			const response = await authApi.login(credentials);
			console.log('login response', response);
			if (response.data.success) {
				setAuth(response.data.data);
				await connect();
				router.push('/marketplace');
			} else {
				throw new Error("Login failed");
			}
		} catch (error) {
			handleApiError(error);
		}
	}

	async function register(userData: RegisterData): Promise<User> {
		try {
			const response = await authApi.register(userData);
			if (response.data.success) {
				setAuth(response.data.data);
				await connect();
				router.push('/marketplace');
				return response.data.data;
			}
			throw new Error("Registration failed");
		} catch (error) {
			handleApiError(error);
			throw error;
			}
		}
	

	function logout(): void {
		token.value = null;
		user.value = null;
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		disconnect();
		router.push('/login');
	}

	function updateCredits(amount: number): void {
		if (user.value) {
			user.value.credits += amount;
			localStorage.setItem("user", JSON.stringify(user.value));
		}
	}

	function setAuth(auth: AuthState): void {
		console.log('setAuth', auth);
		if (auth.token && auth.userId) {
			token.value = auth.token;
			user.value = {
				userId: auth.userId,
				username: auth.username,
				email: auth.email,
				credits: auth.credits,
				referralCode: auth.referralCode
			};
			localStorage.setItem("token", auth.token);
			localStorage.setItem("user", JSON.stringify(user.value));
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
