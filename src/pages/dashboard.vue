<script setup lang="ts">
import { useAuthStore } from '@/@core/stores/auth'

definePage({
  meta: {
    requiresAuth: true, // This marks the route as protected
  },
})

const authStore = useAuthStore()

const userEmail = computed(() => authStore.token ? authStore.users.find(u => u.email)?.email : 'Guest')
</script>

<template>
  <div>
    <VCard title="Dashboard">
      <VCardText>Welcome to your dashboard!</VCardText>
    </VCard>

    <VDivider>
      <RouterLink to="/register" class="text-primary ms-1 d-inline-block text-body-1">
        Go to register to test if we can register again
      </RouterLink>
    </VDivider>

    <VDivider>
      <RouterLink to="/" class="text-primary ms-1 d-inline-block text-body-1">
        Go to login to test if registered user can login
      </RouterLink>
    </VDivider>
  </div>
</template>
