import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useMemoStore = defineStore('memo', () => {
  const memos   = ref([])    // เก็บรายการบันทึกข้อความทั้งหมด
  const current = ref(null)  // เก็บข้อมูลเอกสารชิ้นเดียว (ส่งต่อให้คนที่ 3 และ 4)
  const loading = ref(false) // สถานะโหลดข้อมูล (เอาไว้ทำ Spinner หมุนรอ)

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