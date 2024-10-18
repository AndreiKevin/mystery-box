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

interface Trade {
	id: string;
	price: string;
	quantity: string;
	time: number;
	takerSide: string;
}

export const useMarketStore = defineStore('market', () => {
	const treasures = ref<Treasure[]>([]);
	const mysteryBoxes = ref<MysteryBox[]>([]);
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


	// Dummy data for testing

	function setDummyData(): void {
		treasures.value = [
			{ id: 1, type: 'Common', name: 'Silver Coin', description: 'A shiny silver coin', remaining: 1, total: 100, imageUrl: 'https://www.royalmint.com/globalassets/bullion/images/products/best-value/1oz-silver-britannia/2020_britannia_silver_1oz_obv_-_ukb20st-1500x1500-ea404be.png' },
			{ id: 2, type: 'Rare', name: 'Golden Goblet', description: 'A valuable golden goblet', remaining: 0, total: 20, imageUrl: 'https://static.vecteezy.com/system/resources/previews/046/028/308/non_2x/golden-goblet-on-transparent-background-free-png.png' },
			{ id: 3, type: 'Epic', name: 'Diamond Necklace', description: 'A stunning diamond necklace', remaining: 0, total: 10, imageUrl: 'https://www.harrywinston.com/-/media/project/harry-winston/corporate/harry-winston-int/fine-jewelry/classics-by-harry-winston/round-brilliant-diamond-solitaire-pendant/round_brilliant_diamond_solitaire_pendant_pidprd010si_e-1.png?rev=06f4460e9bb64e30bb4d2f25afa09f7e' },
			{ id: 4, type: 'Legendary', name: 'Ancient Scroll', description: 'A mysterious ancient scroll', remaining: 1, total: 5, imageUrl: 'https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-old-parchment-paper-scroll-png-image_11920774.png' },
		];
		const url = "https://static.vecteezy.com/system/resources/thumbnails/038/566/282/small_2x/charity-box-3d-icon-illustration-3d-rendering-ramadan-illustration-png.png"
		mysteryBoxes.value = [
			{ id: 1, name: 'Bronze Box', price: 100, imageUrl: url },
			{ id: 2, name: 'Silver Box', price: 100, imageUrl: url },
			{ id: 3, name: 'Gold Box', price: 100, imageUrl: url },
			{ id: 4, name: 'Platinum Box', price: 100, imageUrl: url },
			{ id: 5, name: 'Diamond Box', price: 100, imageUrl: url },
			{ id: 6, name: 'Crystal Box', price: 100, imageUrl: url },
			{ id: 7, name: 'Ruby Box', price: 100, imageUrl: url },
			{ id: 8, name: 'Emerald Box', price: 100, imageUrl: url },
		];
	}

	async function purchaseDummyBox(boxId: number): Promise<PurchaseResult | null> {
		const authStore = useAuthStore();
		const box = mysteryBoxes.value.find(b => b.id === boxId);
		if (!box) {
			throw new Error('Invalid box ID');
		}

		if (authStore.userCredits < box.price) {
			throw new Error('Insufficient credits');
		}

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Compute available treasures every time this function is called
		const availableTreasures = computed(() => treasures.value.filter(t => t.remaining > 0));
		// Select a random treasure from available ones
		const randomTreasure = availableTreasures.value[Math.floor(Math.random() * availableTreasures.value.length)];
		// If no treasures are available, throw an error
		if (!randomTreasure) {
			throw new Error('No treasures available');
		}
		authStore.updateCredits(-box.price);
		// update treasure quantity
		updateTreasureQuantity(randomTreasure.id, randomTreasure.remaining - 1);

		return {
			purchaseId: Math.floor(Math.random() * 1000000),
			treasureReceived: randomTreasure,
			remainingCredits: authStore.userCredits,
		};
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
		purchaseDummyBox,
		setDummyData,
		trades,
		addTrade,
	};
});
