<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { poloniexWebSocket } from './services/poloniexWebSocket'

// Connect to the WebSocket when the app is mounted
onMounted(() => {
  poloniexWebSocket
})

defineOptions({
  name: 'App'
});
</script>
