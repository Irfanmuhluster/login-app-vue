<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Products Management</h2>
        <button
          @click="openModal('create')"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <img 
                  :src="product.image" 
                  class="h-10 w-10 rounded-full object-cover"
                  alt="Product image"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ product.category?.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatPrice(product.price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ product.stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': product.is_active,
                    'bg-red-100 text-red-800': !product.is_active
                  }"
                >
                  {{ product.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openModal('edit', product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Form -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-lg font-medium mb-4">
            {{ modalMode === 'create' ? 'Add New Product' : 'Edit Product' }}
          </h3>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 border-gray-300 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select
                  v-model="form.category_id"
                  class="px-3 py-2 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  class="px-3 py-2 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="mt-1 block w-full"
                />
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  class="mt-2 h-20 w-20 object-cover rounded"
                  alt="Preview"
                />
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="form.is_active"
                    type="checkbox"
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-600">Active</span>
                </label>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {{ modalMode === 'create' ? 'Create' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      categories: [],
      showModal: false,
      modalMode: 'create',
      imagePreview: null,
      form: {
        name: '',
        price: 0,
        description: '',
        category_id: '',
        image: null,
        is_active: true,
        stock: 0
      }
    }
  },
  async created() {
    await this.fetchProducts()
    await this.fetchCategories()
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('/api/products')
        this.products = response.data
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('/api/categories')
        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price)
    },
    openModal(mode, product = null) {
      this.modalMode = mode
      this.showModal = true
      if (mode === 'edit' && product) {
        this.form = { ...product }
        this.imagePreview = product.image
      } else {
        this.resetForm()
      }
    },
    closeModal() {
      this.showModal = false
      this.resetForm()
    },
    resetForm() {
      this.form = {
        name: '',
        price: 0,
        description: '',
        category_id: '',
        image: null,
        is_active: true,
        stock: 0
      }
      this.imagePreview = null
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.image = file
        this.imagePreview = URL.createObjectURL(file)
      }
    },
    async handleSubmit() {
      try {
        const formData = new FormData()
        Object.keys(this.form).forEach(key => {
          formData.append(key, this.form[key])
        })

        if (this.modalMode === 'create') {
          await axios.post('/api/products', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          formData.append('_method', 'PUT')
          await axios.post(`/api/products/${this.form.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        }

        await this.fetchProducts()
        this.closeModal()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
    async deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return

      try {
        await axios.delete(`/api/products/${id}`)
        await this.fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }
}
</script>
