<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center">
                <q-card class="register-card q-pa-md">
                    <q-card-section>
                        <div class="text-h6">Register</div>
                    </q-card-section>

                    <q-card-section>
                        <register-form />
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import RegisterForm from 'components/auth/RegisterForm.vue';

defineOptions({
    name: 'RegisterPage',
});
</script>

<style scoped>
.register-card {
    width: 100%;
    max-width: 400px;
}
</style>
