<template>
  <div class="flex-1 flex flex-col items-center justify-center py-16 gap-4 px-4 bg-theme-canvas text-center">
    <p class="text-6xl font-bold text-primary">404</p>
    <h1 class="text-xl font-semibold text-theme-primary">Página no encontrada</h1>
    <p class="text-sm text-theme-muted">La página que buscas no existe o fue movida.</p>
    <Button @click="router.push({ name: 'login' })">Volver al inicio</Button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()
</script>
