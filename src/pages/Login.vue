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
            <router-link to="/poloniex-feed" class="btn btn-secondary">
                View Poloniex Live Trades
            </router-link>
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

.btn-secondary {
    background-color: #6c757d;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    display: inline-block;
}
</style>
