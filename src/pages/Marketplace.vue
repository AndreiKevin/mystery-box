<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <div class="col-12">
                <h5 class="q-my-md">Mystery Box</h5>
                <mystery-box />
            </div>

            <div class="col-12">
                <h5 class="q-my-md">Available Treasures</h5>
                <treasure-grid />
            </div>
        </div>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="refresh" color="primary" @click="refreshInventory" :loading="loading" />
        </q-page-sticky>
    </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import MysteryBox from '@/components/market/MysteryBox.vue'
import TreasureGrid from '@/components/market/TreasureGrid.vue'

export default defineComponent({
    name: 'MarketplacePage',

    components: {
        MysteryBox,
        TreasureGrid
    },

    setup() {
        const store = useStore()
        const loading = ref(false)

        const refreshInventory = async () => {
            loading.value = true
            try {
                await store.dispatch('market/fetchInventory')
            } finally {
                loading.value = false
            }
        }

        onMounted(refreshInventory)

        return {
            loading,
            refreshInventory
        }
    }
})
</script>