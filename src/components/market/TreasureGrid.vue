<template>
    <div class="treasure-grid">
        <div class="row q-col-gutter-md">
            <div v-for="treasure in treasures" :key="treasure.id" class="col-xs-12 col-sm-6 col-md-3">
                <q-card class="treasure-card">
                    <q-img :src="treasure.image_url" :ratio="1" />

                    <q-card-section>
                        <div class="text-h6">{{ treasure.name }}</div>
                        <div class="text-subtitle2">
                            Remaining: {{ treasure.remaining_quantity }}/{{ treasure.initial_quantity }}
                        </div>
                    </q-card-section>

                    <q-linear-progress :value="treasure.remaining_quantity / treasure.initial_quantity" class="q-mt-sm"
                        :color="getProgressColor(treasure.remaining_quantity / treasure.initial_quantity)" />
                </q-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

const treasures = computed(() => marketStore.treasures)

const getProgressColor = (ratio: number) => {
    if (ratio > 0.6) return 'positive'
    if (ratio > 0.3) return 'warning'
    return 'negative'
}
</script>

<style lang="scss" scoped>
.treasure-grid {
    .treasure-card {
        height: 100%;
    }
}
</style>