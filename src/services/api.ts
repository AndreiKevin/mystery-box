import axios from 'axios';

const baseURL = 'http://localhost:3000/api/v1';

export const api = axios.create({
	baseURL,
	timeout: 5000,
});

export const marketApi = {
	getInventory: () => api.get('/market/inventory'),
	purchaseTreasure: (quantity: number) => api.post('/market/purchase', { quantity }),
};

export const usersApi = {
	getBalance: () => api.get('/users/balance'),
};

export const referralApi = {
	validateReferralCode: (referralCode: string) => api.get(`/referral/validate?referralCode=${referralCode}`),
};

export const authApi = {
	register: (registerData: RegisterDto) => api.post('/auth/register', registerData),
	login: (loginData: LoginDto) => api.post('/auth/login', loginData),
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
