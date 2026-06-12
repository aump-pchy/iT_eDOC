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
      // ✨ ปรับแก้: ถ้าหลังบ้านส่งตรงมาเป็น Array ให้รับด้วย data ทันที ถ้ายัดห่อมาค่อยใช้ data.data
      // น้องใส่ดักแบบปลอดภัยไว้ให้: ถ้า data.data มีค่าให้ใช้ data.data ถ้าไม่มีให้ใช้ data ตรง ๆ เลยครับอ้าย
      memos.value = data.data !== undefined ? data.data : data
    } catch (error) {
      console.error('Fetch Memos Error:', error)
    } finally { 
      loading.value = false 
    }
  }

  async function fetchMemo(id) {
    try {
      const { data } = await api.get(`/memos/${id}`)
      // ✨ ปรับแก้ดักโครงสร้าง object เหมือนกัน เพื่อให้เข้ากันได้กับโครงสร้าง API ของกลุ่มอ้าย
      current.value = data.data !== undefined ? data.data : data
    } catch (error) {
      console.error('Fetch Memo Detail Error:', error)
      current.value = null
      throw error // โยนเออร์เรอร์เพื่อให้หน้าบ้านรู้และจัดการดีดหลบหน้าขาวได้
    }
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