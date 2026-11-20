<template>
  <div class="flex flex-1 flex-col bg-theme-canvas transition-colors duration-300">
    <AppHeader :titulo="pageTitle" />

    <main class="flex-1">
      <div class="mx-auto max-w-6xl p-4 sm:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()

const pageTitle = computed(() => route.meta.title || 'Inicio')
</script>
