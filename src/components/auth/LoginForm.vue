<template>
    <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model="form.email" label="Email" type="email" :rules="[val => !!val || 'Email is required']"
            outlined />

        <q-input v-model="form.password" label="Password" :type="isPwd ? 'password' : 'text'"
            :rules="[val => !!val || 'Password is required']" outlined>
            <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
            </template>
        </q-input>

        <div class="full-width q-mt-md">
            <q-btn label="Login" type="submit" color="primary" class="full-width" :loading="loading" />
        </div>

        <div class="text-center q-mt-sm">
            <q-btn flat color="primary" label="Need an account? Register" to="/register" />
        </div>
    </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
    name: "LoginForm",

    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const $q = useQuasar();

        const loading = ref(false);
        const isPwd = ref(true);
        const form = ref({
            email: "",
            password: "",
        });

        const handleSubmit = async () => {
            try {
                loading.value = true;
                await authStore.login(form.value);
                router.push("/marketplace");
            } catch (error) {
                $q.notify({
                    type: "negative",
                    message: error instanceof Error ? error.message : "Login failed",
                });
            } finally {
                loading.value = false;
            }
        };

        return {
            form,
            isPwd,
            loading,
            handleSubmit,
        };
    },
});
</script>
