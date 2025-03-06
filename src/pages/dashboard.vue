<script setup lang="ts">
import { useAuthStore } from '@/@core/stores/auth'

definePage({
  meta: {
    requiresAuth: true, // This marks the route as protected
  },
})

const authStore = useAuthStore()

const userEmail = computed(() => authStore.currentUserEmail || 'Guest')
</script>


<template>
  <div>
    <p>Welcome, {{ userEmail || 'User' }}!</p>
    <VCard title="Create Awesome 🙌">
      <VCardText>This is your second page.</VCardText>
      <VCardText>
        Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
        Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
        wafer tart marzipan bonbon. Gingerbread jelly-o dragée
        chocolate.
      </VCardText>
    </VCard>

    <!-- <VDivider>
      <RouterLink to="/register" class="text-primary ms-1 d-inline-block text-body-1">
        Go to register to test if we can register again
      </RouterLink>
    </VDivider>

    <VDivider>
      <RouterLink to="/" class="text-primary ms-1 d-inline-block text-body-1">
        Go to login to test if registered user can login
      </RouterLink>
    </VDivider> -->
  </div>
</template>
