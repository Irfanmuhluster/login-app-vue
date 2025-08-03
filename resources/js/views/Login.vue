<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-6 rounded shadow-md w-80">
      <h2 class="text-2xl mb-4">Login</h2>
      <p v-if="generalError" class="text-red-500 mt-2">{{ generalError }}</p>
      <input v-model="form.email" type="email" placeholder="Email"
             class="w-full p-2 border rounded mb-2" />
      <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
      <input v-model="form.password" type="password" placeholder="Password"
             class="w-full p-2 border rounded mb-4" />
      <span v-if="errors.password" class="text-red-500">{{ errors.password }}</span>
      <button class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {
        email: '',
        password: ''
      },
      generalError: ''
    }
  },
  methods: {
    async login() {
      try {
        this.errors.email = ''
        this.errors.password = ''
        this.generalError = ''
        
        const response = await this.authStore.login({
          email: this.form.email,
          password: this.form.password
        }, { withCredentials: true })

        console.log('Login successful', response)
        this.$router.push('/dashboard')
      } catch (e) {
        if (e.response.status === 422) {
          const validationErrors = e.response.data.errors
          this.errors.email = validationErrors.email?.[0] || ''
          this.errors.password = validationErrors.password?.[0] || ''
        } else {
          console.log(e.response.data.message)
          this.generalError = e.response.data.message || 'Login failed'
        }
      }
    }
  }
}
</script>
