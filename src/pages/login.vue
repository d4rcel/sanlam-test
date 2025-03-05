<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useAuthStore } from '@/@core/stores/auth'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface ErrorResponse {
  field?: string
  message: string
}

const form = ref<LoginForm>({
  email: '',
  password: '',
  remember: false,
})

const errors = ref<ErrorResponse[]>([])
const isPasswordVisible = ref(false)
const isLoading = ref(false)

const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)
const authV2LoginIllustration = useGenerateImageVariant (authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const authService = {
  async login(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUsers = [
      { email: 'user@example.com', password: 'Password123!' },
      { email: 'admin@example.com', password: 'Admin456!' }
    ]
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    return { token: 'mock-jwt-token', user: { email } }
  }
}

const validateForm = (): boolean => {
  errors.value = []
  
  if (!form.value.email) {
    errors.value.push({ field: 'email', message: 'Email is required' })
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.push({ field: 'email', message: 'Email is invalid' })
  }
  
  if (!form.value.password) {
    errors.value.push({ field: 'password', message: 'Password is required' })
  } else if (form.value.password.length < 8) {
    errors.value.push({ field: 'password', message: 'Password must be at least 8 characters' })
  }
  
  return errors.value.length === 0
}

const login = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errors.value = []
  
  try {
    await authStore.login(form.value.email, form.value.password)
    
    if (form.value.remember) {
      authStore.setRememberedEmail(form.value.email)
    } else {
      authStore.setRememberedEmail(null)
    }
    
    const redirect = route.query.redirect as string || '/dashboard'
    
    router.push(redirect)
  } catch (error) {
    errors.value.push({ message: error instanceof Error ? error.message : 'An error occurred' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (authStore.rememberedEmail) {
    form.value.email = authStore.rememberedEmail
    form.value.remember = true
  }
})

</script>

<template>
  <a href="javascript:void(0)">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </a>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center position-relative"
    >
      <div class="d-flex align-center justify-center pa-10">
        <img
          :src="authV2LoginIllustration"
          class="auth-illustration w-100"
          alt="auth-illustration"
        >
      </div>
      <VImg
        :src="authV2LoginMask"
        class="d-none d-md-flex auth-footer-mask"
        alt="auth-mask"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-5 pa-lg-7"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to <span class="text-capitalize">{{ themeConfig.app.title }}! 👋🏻</span>
          </h4>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="login">
            <VRow>

              <!-- Error messages -->
              <VCol v-if="errors.length" cols="12">
                <VAlert
                  v-for="(error, index) in errors"
                  :key="index"
                  type="error"
                  variant="tonal"
                  class="mb-2"
                >
                  {{ error.message }}
                </VAlert>
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :error-messages="errors.find(e => e.field === 'email')?.message"
                  :disabled="isLoading"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :error-messages="errors.find(e => e.field === 'password')?.message"
                  :disabled="isLoading"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6 gap-x-2">
                  <VCheckbox
                    v-model="form.remember"
                    label="Remember me"
                    :disabled="isLoading"
                  />

                  <a
                    class="text-primary"
                    href="javascript:void(0)"
                  >
                    Forgot Password?
                  </a>
                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">
                  New on our platform?
                </span>
                <RouterLink
                  to="/register"
                  class="text-primary ms-1 d-inline-block text-body-1"
                >
                  Create an account
                </RouterLink>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4 text-high-emphasis">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
