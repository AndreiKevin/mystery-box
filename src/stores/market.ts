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
		treasures.value.reduce((acc, t) => acc + t.remaining_quantity, 0),
	);

	function getTreasureById(id: number): Treasure | undefined {
		return treasures.value.find((t) => t.id === id);
	}

	async function fetchInventory(): Promise<void> {
		try {
			loading.value = true;
			const result = await marketApi.getInventory();
			treasures.value = result.data.treasures;
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
			const result = await marketApi.purchaseBox(authStore.user?.userId as number, boxId);
			console.log('result: ', result);
			if (result.success && result.data) {
				authStore.updateCredits(result.data.data.remainingCredits);
				return result.data.data as PurchaseResult;
			}
			
			throw new Error(result.error);
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error occurred';
			throw err; // propagate the error up to display the error message in the popup UI
		}
	}

	function updateTreasureQuantity(treasureId: number, remaining: number): void {
		const treasure = treasures.value.find((t) => t.id === treasureId);
		if (treasure) {
			treasure.remaining_quantity = remaining;
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
