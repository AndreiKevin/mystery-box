<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="lt-md" />

                <q-toolbar-title>
                    Mystery Box Marketplace
                </q-toolbar-title>

                <div class="q-gutter-sm row items-center no-wrap">
                    <q-chip color="secondary" text-color="white" icon="paid">
                        {{ userCredits }} Credits
                    </q-chip>

                    <q-btn-dropdown flat icon="account_circle" label="Account">
                        <q-list>
                            <q-item clickable v-close-popup @click="logout">
                                <q-item-section avatar>
                                    <q-icon name="logout" />
                                </q-item-section>
                                <q-item-section>Logout</q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
            <q-list>
                <q-item-label header>Menu</q-item-label>

                <q-item clickable v-ripple to="/marketplace">
                    <q-item-section avatar>
                        <q-icon name="shopping_cart" />
                    </q-item-section>
                    <q-item-section>Marketplace</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/inventory">
                    <q-item-section avatar>
                        <q-icon name="inventory_2" />
                    </q-item-section>
                    <q-item-section>My Inventory</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'MainLayout',

    setup() {
        const store = useStore()
        const router = useRouter()
        const leftDrawerOpen = ref(false)

        const userCredits = computed(() => store.state.auth.user.credits)

        const toggleLeftDrawer = () => {
            leftDrawerOpen.value = !leftDrawerOpen.value
        }

        const logout = async () => {
            await store.dispatch('auth/logout')
            router.push('/login')
        }

        return {
            leftDrawerOpen,
            userCredits,
            toggleLeftDrawer,
            logout
        }
    }
})
</script>