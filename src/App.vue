<template>
  <div class="flex min-h-screen flex-col">
    <RouterView />
    <AppFooter />
  </div>
  <Toaster position="top-center" :richColors="true" :closeButton="false" :duration="4000" />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css'
import AppFooter from '@/components/AppFooter.vue'
import { useTheme } from '@/composables/useTheme'

useTheme()
</script>
