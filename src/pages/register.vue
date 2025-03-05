<!-- views/pages/authentication/Register.vue -->
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

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})


interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface ErrorResponse {
  field?: string
  message: string
}

const form = ref<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const errors = ref<ErrorResponse[]>([])
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isLoading = ref(false)

const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)
const authV2LoginIllustration = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const router = useRouter()

const authService = {
  async register(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email.includes('example.com')) {
      throw new Error('Email already exists')
    }
    
    return { token: 'mock-jwt-token', user: { email } }
  }
}

const validateForm = (): boolean => {
  errors.value = []
  
  // Email validation
  if (!form.value.email) {
    errors.value.push({ field: 'email', message: 'Email is required' })
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.push({ field: 'email', message: 'Email is invalid' })
  }
  
  // Password validation
  if (!form.value.password) {
    errors.value.push({ field: 'password', message: 'Password is required' })
  } else if (form.value.password.length < 8) {
    errors.value.push({ field: 'password', message: 'Password must be at least 8 characters' })
  } else if (!/[A-Z]/.test(form.value.password)) {
    errors.value.push({ field: 'password', message: 'Password must contain at least one uppercase letter' })
  } else if (!/[0-9]/.test(form.value.password)) {
    errors.value.push({ field: 'password', message: 'Password must contain at least one number' })
  }
  
  // Confirm password validation
  if (!form.value.confirmPassword) {
    errors.value.push({ field: 'confirmPassword', message: 'Password confirmation is required' })
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.push({ field: 'confirmPassword', message: 'Passwords do not match' })
  }
  
  // Terms validation
  if (!form.value.terms) {
    errors.value.push({ field: 'terms', message: 'You must accept the terms and conditions' })
  }
  
  return errors.value.length === 0
}

const register = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errors.value = []
  
  try {
    const response = await authService.register(form.value.email, form.value.password)
    localStorage.setItem('authToken', response.token)
    router.push('/dashboard')
  } catch (error) {
    errors.value.push({ message: error instanceof Error ? error.message : 'An error occurred' })
  } finally {
    isLoading.value = false
  }
}
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

  <VRow no-gutters class="auth-wrapper">
    <VCol md="8" class="d-none d-md-flex align-center justify-center position-relative">
      <div class="d-flex align-center justify-center pa-10">
        <img :src="authV2LoginIllustration" class="auth-illustration w-100" alt="auth-illustration">
      </div>
      <VImg :src="authV2LoginMask" class="d-none d-md-flex auth-footer-mask" alt="auth-mask" />
    </VCol>
    
    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center" style="background-color: rgb(var(--v-theme-surface));">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-5 pa-lg-7">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Create Your Account 🚀
          </h4>
          <p class="mb-0">
            Start your journey with us today
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="register">
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

              <!-- Email -->
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

              <!-- Password -->
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
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.confirmPassword"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  :error-messages="errors.find(e => e.field === 'confirmPassword')?.message"
                  :disabled="isLoading"
                />
              </VCol>

              <!-- Terms -->
              <VCol cols="12">
                <VCheckbox
                  v-model="form.terms"
                  label="I agree to the Terms and Conditions"
                  :error-messages="errors.find(e => e.field === 'terms')?.message"
                  :disabled="isLoading"
                />
                
                <VBtn
                  block
                  type="submit"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  Register
                </VBtn>
              </VCol>

              <VCol cols="12" class="text-body-1 text-center">
                <span class="d-inline-block">
                  Already have an account?
                </span>
                <RouterLink
                  to="/login"
                  class="text-primary ms-1 d-inline-block text-body-1"
                >
                  Sign in instead
                </RouterLink>
              </VCol>

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4 text-high-emphasis">or</span>
                <VDivider />
              </VCol>

              <VCol cols="12" class="text-center">
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
