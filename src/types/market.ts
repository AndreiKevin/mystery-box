import { z } from 'zod';

export const TreasureValidator = z.object({
	id: z.number(),
	created_at: z.string(),
	description: z.string(),
	name: z.string(),
	image_url: z.string().url(),
	initial_quantity: z.number(),
	remaining_quantity: z.number(),
});

export type Treasure = z.infer<typeof TreasureValidator>;

export const MysteryBoxValidator = z.object({
	created_at: z.string(),
	id: z.number(),
	image_url: z.string().url(),
	name: z.string(),
	price: z.number(),
});

export type MysteryBox = z.infer<typeof MysteryBoxValidator>;

export const PurchaseResultValidator = z.object({
	treasureReceived: TreasureValidator,
	remainingCredits: z.coerce.number(),
});

export type PurchaseResult = z.infer<typeof PurchaseResultValidator>;

export const MarketStateValidator = z.object({
	treasures: z.array(TreasureValidator),
	mysteryBoxes: z.array(MysteryBoxValidator),
	loading: z.boolean(),
	error: z.string().nullable(),
});

export type MarketState = z.infer<typeof MarketStateValidator>;
