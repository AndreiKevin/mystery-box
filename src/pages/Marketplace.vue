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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMarketStore } from '@/stores/market'
import MysteryBox from '@/components/market/MysteryBox.vue'
import TreasureGrid from '@/components/market/TreasureGrid.vue'

const marketStore = useMarketStore()
const loading = ref(false)

// Commented out original refreshInventory function
const refreshInventory = async () => {
    loading.value = true
    try {
        await marketStore.fetchInventory()
        await marketStore.fetchMysteryBoxes()
    } finally {
        loading.value = false
    }
}

// Temporary refreshInventory function with dummy data
// const refreshInventory = () => {
//     loading.value = true
//     setTimeout(() => {
//         marketStore.setDummyData()
//         loading.value = false
//     }, 1000)
// }

onMounted(refreshInventory)

defineOptions({
    name: 'MarketplacePage'
})
</script>
