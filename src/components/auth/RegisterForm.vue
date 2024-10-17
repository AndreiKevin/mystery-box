<template>
    <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model="form.username" label="Username" :rules="[val => !!val || 'Username is required']" outlined />

        <q-input v-model="form.email" label="Email" type="email" :rules="[
            val => !!val || 'Email is required',
            val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Invalid email format'
        ]" outlined />

        <q-input v-model="form.password" label="Password" :type="isPwd ? 'password' : 'text'" :rules="[
            val => !!val || 'Password is required',
            val => val.length >= 8 || 'Password must be at least 8 characters long'
        ]" outlined>
            <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
            </template>
        </q-input>

        <q-input v-model="form.confirmPassword" label="Confirm Password" :type="isPwd ? 'password' : 'text'" :rules="[
            val => !!val || 'Please confirm your password',
            val => val === form.password || 'Passwords do not match'
        ]" outlined />

        <div class="full-width q-mt-md">
            <q-btn label="Register" type="submit" color="primary" class="full-width" :loading="loading" />
        </div>

        <div class="text-center q-mt-sm">
            <q-btn flat color="primary" label="Already have an account? Login" to="/login" />
        </div>
    </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
    name: 'RegisterForm',

    setup() {
        const authStore = useAuthStore()
        const router = useRouter()
        const $q = useQuasar()

        const loading = ref(false)
        const isPwd = ref(true)
        const form = ref({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        })

        const handleSubmit = async () => {
            if (form.value.password !== form.value.confirmPassword) {
                $q.notify({
                    type: 'negative',
                    message: 'Passwords do not match'
                })
                return
            }

            try {
                loading.value = true
                await authStore.register({
                    username: form.value.username,
                    email: form.value.email,
                    password: form.value.password
                })
                router.push('/marketplace')
            } catch (error) {
                $q.notify({
                    type: 'negative',
                    message: error instanceof Error ? error.message : 'Registration failed'
                })
            } finally {
                loading.value = false
            }
        }

        return {
            form,
            isPwd,
            loading,
            handleSubmit
        }
    }
})
</script>
