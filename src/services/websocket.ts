import { ref } from "vue";
import { io, type Socket } from "socket.io-client";
import { useMarketStore } from "@/stores/market";
import { useAuthStore } from "@/stores/auth";

export function useWebSocket() {
	const socket = ref<Socket | null>(null);
	const reconnectAttempts = ref(0);
	const maxReconnectAttempts = 5;
	const reconnectDelay = 1000;

	const marketStore = useMarketStore();
	const authStore = useAuthStore();

	function connect(): void {
		socket.value = io(import.meta.env.VITE_WS_URL, {
			auth: {
				token: authStore.token,
			},
		});

		socket.value.on("connect", onConnect);
		socket.value.on("disconnect", onDisconnect);
		socket.value.on("INVENTORY_UPDATE", onInventoryUpdate);
		socket.value.on("PURCHASE_MADE", onPurchaseMade);
		socket.value.on("ERROR", onError);
	}

	function disconnect(): void {
		if (socket.value) {
			socket.value.disconnect();
			socket.value = null;
		}
	}

	function onConnect(): void {
		console.log("WebSocket connected");
		reconnectAttempts.value = 0;
	}

	function onDisconnect(): void {
		console.log("WebSocket disconnected");
		if (reconnectAttempts.value < maxReconnectAttempts) {
			setTimeout(() => {
				reconnectAttempts.value++;
				connect();
			}, reconnectDelay * 2 ** reconnectAttempts.value);
		}
	}

	function onInventoryUpdate(data: {
		treasureId: number;
		remaining: number;
	}): void {
		marketStore.updateTreasureQuantity(data.treasureId, data.remaining);
	}

	function onPurchaseMade(data: {
		treasureId: number;
		remaining: number;
	}): void {
		marketStore.updateTreasureQuantity(data.treasureId, data.remaining);
	}

	function onError(error: { message: string }): void {
		console.error("WebSocket error:", error);
	}

	return {
		connect,
		disconnect,
	};
}
