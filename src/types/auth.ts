export interface User {
	id: number;
	username: string;
	email: string;
	referralCode: string;
	credits: number;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	username: string;
	email: string;
	password: string;
	referralCode?: string;
}

export interface AuthState {
	token: string | null;
	user: User | null;
}
