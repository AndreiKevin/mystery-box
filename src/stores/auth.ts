import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
	User,
	LoginCredentials,
	RegisterData,
	AuthState,
} from "@/types/auth";
import { useRouter } from 'vue-router';

// Commented out imports that are not needed for dummy data
// import { api } from "@/services/api";
// import { useWebSocket } from "@/services/websocket";
// import { AxiosError } from 'axios';

export const useAuthStore = defineStore("auth", () => {
	const router = useRouter();
	const token = ref<string | null>(localStorage.getItem("token"));
	const user = ref<User | null>(
		JSON.parse(localStorage.getItem("user") || "null"),
	);
	// const { connect, disconnect } = useWebSocket();

	const isAuthenticated = computed(() => !!token.value);
	const userCredits = computed(() => user.value?.credits ?? 0);

	// Dummy user data
	const dummyUsers: User[] = [
		{ id: 1, username: "1", email: "1@1.com", credits: 1000 },
		{ id: 2, username: "2", email: "2@2.com", credits: 2000 },
	];

	async function login(credentials: LoginCredentials): Promise<void> {
		// Simulate API call delay
		await new Promise(resolve => setTimeout(resolve, 500));

		const foundUser = dummyUsers.find(u => u.email === credentials.email);
		if (foundUser) {
			setAuth({ token: "dummy_token", user: foundUser });
			// await connect();

			// Add redirection after successful login
			router.push('/marketplace');
		} else {
			throw new Error("Invalid credentials");
		}
	}

	async function register(userData: RegisterData): Promise<User> {
		// Simulate API call delay
		await new Promise(resolve => setTimeout(resolve, 500));

		const newUser: User = {
			id: dummyUsers.length + 1,
			username: userData.username,
			email: userData.email,
			credits: 500, // Default credits for new users
		};
		dummyUsers.push(newUser);
		setAuth({ token: "dummy_token", user: newUser });
		router.push('/marketplace');
		// await connect();
		return newUser;
	}

	function logout(): void {
		token.value = null;
		user.value = null;
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		// disconnect();
		router.push('/login');
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

	// Commented out as it's not needed for dummy data
	// function handleApiError(error: unknown): void {
	// 	if (error instanceof AxiosError) {
	// 		console.error("API Error:", error.response?.data || error.message);
	// 	} else {
	// 		console.error("Unknown error:", error);
	// 	}
	// 	logout(); // Clear any existing auth data on error
	// }

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

// Commented out original code
/*
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
*/
