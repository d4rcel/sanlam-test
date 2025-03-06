<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/@core/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated())

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
</script>

<template>
  <div class="d-flex align-items-center gap-2">
    <template v-if="isAuthenticated">
      <VBtn color="error" class="mr-2" @click="handleLogout">
        Logout
      </VBtn>
    </template>
    <template v-else>
      <VBtn color="primary" class="mr-2" @click="goToLogin">
        Login
      </VBtn>
      <VBtn color="secondary" class="mr-2" @click="goToRegister">
        Sign Up
      </VBtn>
    </template>
  </div>
</template>
