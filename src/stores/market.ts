import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { marketApi } from '@/services/api';
import type {
	Treasure,
	PurchaseResult,
	MysteryBox,
} from '@/types/market';
import { useAuthStore } from './auth';

interface Trade {
	id: string;
	price: string;
	quantity: string;
	time: number;
	takerSide: string;
}

export const useMarketStore = defineStore('market', () => {
	const mysteryBoxes = ref<MysteryBox[]>([]);
	const treasures = ref<Treasure[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const trades = ref<Trade[]>([]);
	function addTrade(trade: Trade) {
		trades.value.unshift(trade);
		if (trades.value.length > 20) {
			trades.value.pop();
		}
	}

	const remainingTreasures = computed(() =>
		treasures.value.reduce((acc, t) => acc + t.remaining, 0),
	);

	function getTreasureById(id: number): Treasure | undefined {
		return treasures.value.find((t) => t.id === id);
	}

	async function fetchInventory(): Promise<void> {
		try {
			loading.value = true;
			treasures.value = await marketApi.getInventory();
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function fetchMysteryBoxes(): Promise<void> {
		try {
			loading.value = true;
			mysteryBoxes.value = await marketApi.getMysteryBoxes();
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function purchaseBox(boxId: number): Promise<PurchaseResult | null> {
		const authStore = useAuthStore();

		try {
			const result = await marketApi.purchaseBox(boxId);
			authStore.updateCredits(result.remainingCredits);
			return result;
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		}
	}

	function updateTreasureQuantity(treasureId: number, remaining: number): void {
		const treasure = treasures.value.find((t) => t.id === treasureId);
		if (treasure) {
			treasure.remaining = remaining;
		}

	}

	return {
		mysteryBoxes,
		treasures,
		loading,
		error,
		remainingTreasures,
		getTreasureById,
		fetchInventory,
		purchaseBox,
		fetchMysteryBoxes,
		updateTreasureQuantity,
		trades,
		addTrade,
	};
});
