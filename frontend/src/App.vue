<template>
  <AppNavbar v-if="auth.isLoggedIn" />
  <RouterView />
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>