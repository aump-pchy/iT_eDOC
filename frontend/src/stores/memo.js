import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemoStore = defineStore('memo', () => {
  const memos   = ref([])
  const current = ref(null)
  const loading = ref(false)

  return { memos, current, loading }
})