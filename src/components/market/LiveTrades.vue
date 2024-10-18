<!-- src/components/market/LiveTrades.vue -->

<template>
    <div class="live-trades">
        <h2>Live Trades: BTC_USDT</h2>
        <table>
            <thead>
                <tr>
                    <th>Row</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Time</th>
                    <th>Side</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(trade, index) in trades" :key="trade.id" :class="trade.takerSide">
                    <td>{{ index + 1 }}</td>
                    <td>{{ trade.price }}</td>
                    <td>{{ trade.quantity }}</td>
                    <td>{{ formatTime(trade.time) }}</td>
                    <td>{{ trade.takerSide }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMarketStore } from '@/stores/market';

const marketStore = useMarketStore();
const trades = computed(() => marketStore.trades);

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
}
</script>

<style scoped>
.live-trades {
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.buy {
    background-color: rgba(0, 255, 0, 0.1);
}

.sell {
    background-color: rgba(255, 0, 0, 0.1);
}
</style>