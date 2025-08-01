<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Selamat datang di dashboard, {{ user.name }}
        </p>
      </div>
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <div>
            <p class="text-center text-gray-700">
              Anda telah berhasil login!
            </p>
          </div>
          <div>
            <button
              @click.prevent="logout"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {}
    }
  },
  async createdCek() {
    const token = localStorage.getItem('token')
    if (!token) {
        this.$router.push('/')
        return
    }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const res = await axios.get('/api/user')
      this.user = res.data
  },
  methods: {
    async logout() {
        const logout = await axios.post('/api/logout')
        console.log(logout.data.message)

        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        this.$router.push('/')
    }
  }
}
</script> 