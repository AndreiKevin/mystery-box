<template>
    <div class="treasure-grid">
        <div class="row q-col-gutter-md">
            <div v-for="treasure in treasures" :key="treasure.id" class="col-xs-12 col-sm-6 col-md-3">
                <q-card class="treasure-card">
                    <q-img :src="treasure.imageUrl" :ratio="1" />

                    <q-card-section>
                        <div class="text-h6">{{ treasure.name }}</div>
                        <div class="text-subtitle2">
                            Remaining: {{ treasure.remaining }}/{{ treasure.total }}
                        </div>
                    </q-card-section>

                    <q-linear-progress :value="treasure.remaining / treasure.total" class="q-mt-sm"
                        :color="getProgressColor(treasure.remaining / treasure.total)" />
                </q-card>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'TreasureGrid',

    setup() {
        const store = useStore()

        const treasures = computed(() => store.state.market.treasures)

        const getProgressColor = (ratio) => {
            if (ratio > 0.6) return 'positive'
            if (ratio > 0.3) return 'warning'
            return 'negative'
        }

        return {
            treasures,
            getProgressColor
        }
    }
})
</script>

<style lang="scss" scoped>
.treasure-grid {
    .treasure-card {
        height: 100%;
    }
}
</style>