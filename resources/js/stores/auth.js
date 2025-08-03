// stores/auth.js
import { defineStore } from 'pinia'
import axios from '@/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
    actions: {
        // 1. Panggil endpoint CSRF dari Sanctum
        async getCsrfCookie() {
            await axios.get('/sanctum/csrf-cookie');
        },

        // 2. Ambil data pengguna yang sedang login
        async fetchUser() {
            try {
                const { data } = await axios.get('/api/user');
                this.user = data;
            } catch (error) {
                this.user = null; // Jika error (misal 401), berarti tidak ada sesi
            }
        },

        // 3. Proses Login
        async login(credentials) {
            await this.getCsrfCookie(); // Ambil cookie CSRF sebelum login
            const response = await axios.post('/api/login', credentials);
            this.user = response.data.user
            await this.fetchUser(); // Setelah login, ambil data pengguna
            return response
        },

        // 4. Proses Logout
        async logout() {
            await axios.post('/api/logout');
            this.user = null;
        },
    },
})
