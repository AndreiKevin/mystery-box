import { z } from 'zod';

export const TreasureValidator = z.object({
	id: z.number(),
	type: z.string(),
	name: z.string(),
	description: z.string(),
	remaining: z.number(),
	total: z.number(),
	imageUrl: z.string().url(),
});

export type Treasure = z.infer<typeof TreasureValidator>;

export const MysteryBoxValidator = z.object({
	id: z.number(),
	name: z.string(),
	price: z.number(),
	imageUrl: z.string().url(),
});

export type MysteryBox = z.infer<typeof MysteryBoxValidator>;

export const PurchaseResultValidator = z.object({
	purchaseId: z.number(),
	treasureReceived: TreasureValidator,
	remainingCredits: z.number(),
});

export type PurchaseResult = z.infer<typeof PurchaseResultValidator>;

export const MarketStateValidator = z.object({
	treasures: z.array(TreasureValidator),
	mysteryBoxes: z.array(MysteryBoxValidator),
	loading: z.boolean(),
	error: z.string().nullable(),
});

export type MarketState = z.infer<typeof MarketStateValidator>;
