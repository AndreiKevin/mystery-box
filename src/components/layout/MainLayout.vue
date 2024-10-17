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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const leftDrawerOpen = ref(false)
const authStore = useAuthStore()

const userCredits = computed(() => authStore.userCredits)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
    authStore.logout()
    // Use router from vue-router to navigate
    import('vue-router').then(({ useRouter }) => {
        const router = useRouter()
        router.push('/login')
    })
}
</script>
