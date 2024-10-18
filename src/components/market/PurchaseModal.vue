<template>
    <q-dialog v-model="showModal" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">Confirm Purchase</div>
            </q-card-section>

            <q-card-section v-if="selectedBox">
                <p>Are you sure you want to purchase {{ selectedBox.name }} for {{ selectedBox.price }} credits?</p>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Confirm" color="primary" @click="confirmPurchase" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MysteryBox } from '@/types/market';

const props = defineProps<{
    modelValue: boolean;
    selectedBox: MysteryBox | null;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'purchase', box: MysteryBox): void;
}>();

const showModal = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

function confirmPurchase() {
    if (props.selectedBox) {
        emit('purchase', props.selectedBox);
    }
}
</script>
