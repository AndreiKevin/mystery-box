export interface Treasure {
	id: number;
	type: string;
	name: string;
	description: string;
	remaining: number;
	total: number;
	imageUrl: string;
}

export interface MysteryBox {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
}

export interface PurchaseResult {
	purchaseId: number;
	treasureReceived: Treasure;
	remainingCredits: number;
}

export interface MarketState {
	treasures: Treasure[];
	mysteryBoxes: MysteryBox[];
	loading: boolean;
	error: string | null;
}
