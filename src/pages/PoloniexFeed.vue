<template>
    <div class="poloniex-feed">
        <h1>Poloniex Live Data</h1>
        <LiveTrades />
    </div>
</template>

<script setup lang="ts">
import LiveTrades from '@/components/market/LiveTrades.vue';
</script>

<style scoped>
.poloniex-feed {
    padding: 20px;
}
</style>