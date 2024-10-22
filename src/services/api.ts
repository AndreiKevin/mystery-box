import { useAuthStore } from '@/stores/auth';
import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import {
  TreasureValidator,
  MysteryBoxValidator,
  PurchaseResultValidator
} from '@/types/market';
import { AuthResponse } from '@/types/auth';

export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_API_URL,
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

// before response is returned, check if the response is a 401
// if so, logout and redirect to login
api.interceptors.response.use(
	(response) => {
		console.log('MY LOG: RESPONSE', response);
		return response;
	},
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

const InventoryResponseValidator = z.object({
	data: z.object({
		treasures: z.array(TreasureValidator),
	}),
});

const MysteryBoxesResponseValidator = z.object({
	data: z.object({
		mysteryBoxes: z.array(MysteryBoxValidator),
	}),
});

const PurchaseResponseValidator = z.object({
	data: PurchaseResultValidator,
});

export const marketApi = {
	getInventory: async () => {
		try {
			const response = await api.get('/api/v1/market/inventory');
			const parsedData = JSON.parse(response.data);
			if (!parsedData.success) {
				throw new Error('Failed to fetch inventory');
			}
			const result = InventoryResponseValidator.safeParse(parsedData.data);

			if (result.success) {
				return result.data.data.treasures;
			}
			
			console.error('Invalid inventory data:', result.error);
			throw new Error('Invalid inventory data received');
		} catch (err) {
			throw err instanceof Error ? err : new Error('Unknown error occurred');
		}
	},

	getMysteryBoxes: async () => {
		try {
			const response = await api.get('/api/v1/market/mystery-boxes');
			const parsedData = JSON.parse(response.data);
			if (!parsedData.success) {
				throw new Error('Failed to fetch mystery boxes');
			}

			const result = MysteryBoxesResponseValidator.safeParse(parsedData.data);

			if (result.success) {
				return result.data.data.mysteryBoxes;
			}
			
			console.error('Invalid mystery boxes data:', result.error);
			throw new Error('Invalid mystery boxes data received');
		} catch (err) {
			throw err instanceof Error ? err : new Error('Unknown error occurred');
		}
	},

	purchaseBox: async (boxId: number) => {
		try {
			const response = await api.post('/api/v1/market/purchase', {
				boxId,
				quantity: 1,
			});
			const parsedData = JSON.parse(response.data);
			if (!parsedData.success) {
				throw new Error('Failed to purchase box');
			}

			const result = PurchaseResponseValidator.safeParse(parsedData.data);

			if (result.success) {
				return result.data.data;
			}

			console.error('Invalid purchase data:', result.error);
			throw new Error('Invalid purchase data received');
		} catch (err) {
			throw err instanceof Error ? err : new Error('Unknown error occurred');
		}
	},
};

export const usersApi = {
	getBalance: async () => {
		const response = await api.get('/api/v1/users/balance');
		const parsedData = JSON.parse(response.data);
		if (!parsedData.success) {
			throw new Error('Failed to fetch balance');
		}
		return parsedData.data;
	},
};

export const referralApi = {
	validateReferralCode: async (referralCode: string) => {
		const response = await api.get(`/api/v1/referral/validate?referralCode=${referralCode}`);
		const parsedData = JSON.parse(response.data);
		if (!parsedData.success) {
			throw new Error('Failed to validate referral code');
		}
		return parsedData.data;
	},
};

export const authApi = {
	register: (registerData: RegisterDto) => api.post<AuthResponse>('/api/v1/auth/register', registerData),
	login: (loginData: LoginDto) => api.post<AuthResponse>('/api/v1/auth/login', loginData),
};

interface RegisterDto {
	username: string;
	email: string;
	password: string;
	referralCode?: string;
}

interface LoginDto {
	email: string;
	password: string;
}
