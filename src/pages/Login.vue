<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center">
                <q-card class="login-card q-pa-md">
                    <q-card-section>
                        <div class="text-h6">Login</div>
                    </q-card-section>

                    <q-card-section>
                        <login-form />
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';

defineOptions({
    name: 'LoginPage'
});
</script>

<style scoped>
.login-card {
    width: 100%;
    max-width: 400px;
}
</style>
