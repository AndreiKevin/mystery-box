<template>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from 'components/auth/LoginForm.vue';

export default defineComponent({
    name: 'LoginPage',
    components: {
        LoginForm,
    },
});
</script>

<style scoped>
.login-card {
    width: 100%;
    max-width: 400px;
}
</style>
