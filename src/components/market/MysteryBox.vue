<template>
    <div class="mystery-boxes">
        <div v-for="box in mysteryBoxes" :key="box.id" class="mystery-box">
            <q-card class="my-card cursor-pointer" @click="openPurchaseModal(box)">
                <q-img :src="box.image_url" :ratio="1" class="mystery-box-image" />

                <q-card-section>
                    <div class="text-h6">{{ box.name }}</div>
                    <div class="text-subtitle2">Price: {{ box.price }} credits</div>
                </q-card-section>

                <q-card-actions align="center">
                    <q-btn color="primary" label="Purchase" :disabled="!canPurchase(box)"
                        @click.stop="openPurchaseModal(box)" />
                </q-card-actions>
            </q-card>
        </div>

        <q-dialog v-model="showResult" persistent>
            <q-card class="result-card">
                <q-card-section class="column items-center">
                    <div class="text-h6">Your Treasure!</div>
                    <q-img v-if="resultTreasure" :src="resultTreasure.image_url" :ratio="1"
                        class="treasure-image q-mt-md" />
                    <div v-if="resultTreasure" class="text-h5 q-mt-md">{{ resultTreasure.name }}</div>
                    <div v-if="resultTreasure" class="text-subtitle2">{{ resultTreasure.description }}</div>
                </q-card-section>

                <q-card-actions align="center">
                    <q-btn color="primary" label="Awesome!" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <purchase-modal v-model="showPurchaseModal" :selected-box="selectedBox" @purchase="purchase" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useMarketStore } from '@/stores/market';
import { useAuthStore } from '@/stores/auth';
import type { Treasure, MysteryBox } from '@/types/market';
import PurchaseModal from './PurchaseModal.vue';

const $q = useQuasar();
const marketStore = useMarketStore();
const authStore = useAuthStore();

const loading = ref(false);
const showResult = ref(false);
const resultTreasure = ref<Treasure | null>(null);
const showPurchaseModal = ref(false);
const selectedBox = ref<MysteryBox | null>(null);

// make sure to track if more mystery boxes (this can happen if Marketplace.vue refetches api)
const mysteryBoxes = computed(() => marketStore.mysteryBoxes);

const canPurchase = (box: MysteryBox) => authStore.userCredits >= box.price;

onMounted(async () => {
    await marketStore.fetchMysteryBoxes();
});
function openPurchaseModal(box: MysteryBox) {
    selectedBox.value = box;
    showPurchaseModal.value = true;
}

async function purchase(box: MysteryBox): Promise<void> {
    if (!canPurchase(box)) {
        $q.notify({
            type: 'negative',
            message: 'Insufficient credits'
        });
        return;
    }

    try {
        loading.value = true;
        const result = await marketStore.purchaseBox(box.id);
        if (result) {
            resultTreasure.value = result.treasureReceived;
            showResult.value = true;
            $q.notify({
                type: 'positive',
                message: `You received: ${result.treasureReceived.name}`
            });
        }
    } catch (error) {
    $q.notify({
            type: 'negative',
            message: error instanceof Error ? error.message : 'Purchase failed'
        });
    } finally {
        loading.value = false;
    }
}
</script>

<style lang="scss" scoped>
.mystery-boxes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.mystery-box {
    flex: 0 1 300px;
    max-width: 300px;

    .my-card {
        width: 100%;
    }

    .mystery-box-image {
        transition: transform 0.3s;

        &:hover {
            transform: scale(1.05);
        }
    }
}

.result-card {
    min-width: 300px;
    max-width: 90vw;

    .treasure-image {
        width: 200px;
        height: 200px;
        max-width: 100%;
        object-fit: contain;
    }
}

@media (max-width: 599px) {
    .mystery-box {
        flex: 0 1 100%;
        max-width: 100%;
    }
}
</style>
