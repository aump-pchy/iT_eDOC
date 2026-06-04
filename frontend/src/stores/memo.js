import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useMemoStore = defineStore('memo', () => {
  const memos   = ref([])
  const current = ref(null)
  const loading = ref(false)

  async function fetchMemos(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/memos', { params })
      memos.value = data.data
    } finally { loading.value = false }
  }

  async function fetchMemo(id) {
    const { data } = await api.get(`/memos/${id}`)
    current.value = data.data
  }

  async function createMemo(payload) {
    const { data } = await api.post('/memos', payload)
    return data
  }

  async function updateMemo(id, payload) {
    const { data } = await api.put(`/memos/${id}`, payload)
    return data
  }

  async function deleteMemo(id) {
    await api.delete(`/memos/${id}`)
    memos.value = memos.value.filter(m => m.id !== id)
  }

  return { memos, current, loading, fetchMemos, fetchMemo, createMemo, updateMemo, deleteMemo }
})