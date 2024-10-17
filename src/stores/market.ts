import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Treasure, PurchaseResult, MysteryBox } from '@/types/market';
import { api } from '@/services/api';
import { useAuthStore } from './auth';

export const useMarketStore = defineStore('market', () => {
	const treasures = ref<Treasure[]>([]);
	const mysteryBoxes = ref<MysteryBox[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const remainingTreasures = computed(() =>
		treasures.value.reduce((acc, t) => acc + t.remaining, 0),
	);

	function getTreasureById(id: number): Treasure | undefined {
		return treasures.value.find((t) => t.id === id);
	}

	async function fetchInventory(): Promise<void> {
		try {
			loading.value = true;
			const response = await api.get<{ data: { treasures: Treasure[] } }>(
				'/api/v1/market/inventory',
			);
			treasures.value = response.data.treasures;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function fetchMysteryBoxes(): Promise<void> {
		try {
			loading.value = true;
			const response = await api.get<{ data: { mysteryBoxes: MysteryBox[] } }>(
				'/api/v1/market/mystery-boxes',
			);
			mysteryBoxes.value = response.data.mysteryBoxes;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function purchaseBox(boxId: number): Promise<PurchaseResult> {
		const authStore = useAuthStore();
		try {
			const response = await api.post<{ data: PurchaseResult }>(
				'/api/v1/market/purchase',
				{
					boxId,
					quantity: 1,
				},
			);

			authStore.updateCredits(response.data.remainingCredits);
			return response.data;
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'Unknown error occurred';
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
		treasures,
		mysteryBoxes,
		loading,
		error,
		remainingTreasures,
		getTreasureById,
		fetchInventory,
		fetchMysteryBoxes,
		purchaseBox,
		updateTreasureQuantity,
	};
});
