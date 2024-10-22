import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { marketApi } from '@/services/api';
import { Treasure, PurchaseResult } from '@/types/market';

export const useMarketStore = defineStore('market', () => {
	const treasures = ref<Treasure[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	async function fetchInventory(): Promise<void> {
		try {
			loading.value = true;
			const response = await marketApi.getInventory();
			treasures.value = response.data.data.treasures;
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function purchaseBox(quantity: number): Promise<PurchaseResult | null> {
		try {
			const response = await marketApi.purchaseTreasure(quantity);
			return response.data.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		}
	}

	return {
		treasures,
		loading,
		error,
		fetchInventory,
		purchaseBox,
	};
});
