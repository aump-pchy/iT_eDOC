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
      // 🚀 [ปรับแก้]: เติม /api เข้าไปข้างหน้า
      const { data } = await api.get('/api/memos', { params })
      memos.value = data.data !== undefined ? data.data : data
    } catch (error) {
      console.error('Fetch Memos Error:', error)
    } finally { 
      loading.value = false 
    }
  }

  async function fetchMemo(id) {
    try {
      // 🚀 [ปรับแก้]: เติม /api เข้าไปข้างหน้า
      const { data } = await api.get(`/api/memos/${id}`)
      current.value = data.data !== undefined ? data.data : data
    } catch (error) {
      console.error('Fetch Memo Detail Error:', error)
      current.value = null
      throw error 
    }
  }

  async function createMemo(payload) {
    // 🚀 [ปรับแก้]: เติม /api เข้าไปข้างหน้า
    const { data } = await api.post('/api/memos', payload)
    return data
  }

  async function updateMemo(id, payload) {
    // 🚀 [ปรับแก้]: เติม /api เข้าไปข้างหน้า
    const { data } = await api.put(`/api/memos/${id}`, payload)
    return data
  }

  async function deleteMemo(id) {
    // 🚀 [ปรับแก้]: เติม /api เข้าไปข้างหน้า
    await api.delete(`/api/memos/${id}`)
    memos.value = memos.value.filter(m => m.id !== id)
  }

  return { memos, current, loading, fetchMemos, fetchMemo, createMemo, updateMemo, deleteMemo }
})