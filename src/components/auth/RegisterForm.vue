<template>
    <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model="form.username" label="Username" :rules="[val => !!val || 'Username is required']" outlined />

        <q-input v-model="form.email" label="Email" type="email" :rules="[val => !!val || 'Email is required']"
            outlined />

        <q-input v-model="form.password" label="Password" :type="isPwd ? 'password' : 'text'" :rules="[
            val => !!val || 'Password is required',
            val => val.length >= 8 || 'Password must be at least 8 characters'
        ]" outlined>
            <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
            </template>
        </q-input>

        <q-input v-model="form.referralCode" label="Referral Code (Optional)" outlined />

        <div class="full-width q-mt-md">
            <q-btn label="Register" type="submit" color="primary" class="full-width" :loading="loading" />
        </div>

        <div class="text-center q-mt-sm">
            <q-btn flat color="primary" label="Already have an account? Login" to="/login" />
        </div>
    </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'RegisterForm',

    setup() {
        const store = useStore()
        const router = useRouter()
        const $q = useQuasar()

        const loading = ref(false)
        const isPwd = ref(true)
        const form = ref({
            username: '',
            email: '',
            password: '',
            referralCode: ''
        })

        const handleSubmit = async () => {
            try {
                loading.value = true
                const result = await store.dispatch('auth/register', form.value)
                $q.notify({
                    type: 'positive',
                    message: `Registration successful! Your referral code is: ${result.referralCode}`
                })
                router.push('/marketplace')
            } catch (error) {
                $q.notify({
                    type: 'negative',
                    message: error.message || 'Registration failed'
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