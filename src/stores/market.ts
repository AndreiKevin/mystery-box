import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
	type Treasure,
	type PurchaseResult,
	type MysteryBox,
	TreasureValidator,
	MysteryBoxValidator,
	PurchaseResultValidator
} from '@/types/market';
import { api } from '@/services/api';
import { useAuthStore } from './auth';
import { z } from 'zod';

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
			const response = await api.get('/api/v1/market/inventory');
			const result = InventoryResponseValidator.safeParse(response);

			if (result.success) {
				treasures.value = result.data.data.treasures;
			} else {
				console.error('Invalid inventory data:', result.error);
				error.value = 'Invalid inventory data received';
			}
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
			const response = await api.get('/api/v1/market/mystery-boxes');
			const result = MysteryBoxesResponseValidator.safeParse(response);

			if (result.success) {
				mysteryBoxes.value = result.data.data.mysteryBoxes;
			} else {
				console.error('Invalid mystery boxes data:', result.error);
				error.value = 'Invalid mystery boxes data received';
			}
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'Unknown error occurred';
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function purchaseBox(boxId: number): Promise<PurchaseResult | null> {
		const authStore = useAuthStore();
		try {
			const response = await api.post('/api/v1/market/purchase', {
				boxId,
				quantity: 1,
			});
			const result = PurchaseResponseValidator.safeParse(response);

			if (result.success) {
				authStore.updateCredits(result.data.data.remainingCredits);
				return result.data.data;
			}
			console.error('Invalid purchase data:', result.error);
			error.value = 'Invalid purchase data received';
			return null;
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
