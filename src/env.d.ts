/* eslint-disable */

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: string;
		VUE_ROUTER_MODE: "hash" | "history" | "abstract" | undefined;
		VUE_ROUTER_BASE: string | undefined;
	}
}

interface ImportMetaEnv {
	readonly BACKEND_API_URL: string;
	readonly BACKEND_WS_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
