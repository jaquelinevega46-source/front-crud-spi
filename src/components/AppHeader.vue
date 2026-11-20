<template>
  <header class="sticky top-0 z-30 bg-gradient-brand text-white shadow-brand">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <div class="flex items-center gap-3 min-w-0">
        <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Users class="size-5" />
        </div>
        <div class="min-w-0">
          <p class="text-base font-bold tracking-wide">CRUD-SPI</p>
          <p class="truncate text-xs text-white/75">{{ titulo }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <div class="flex items-center gap-2">
          <img src="/img/default-avatar.png" alt="Avatar" class="size-9 rounded-full border-2 border-white/40 object-cover" />
          <div class="hidden sm:flex flex-col leading-tight">
            <span class="text-sm font-medium">Bienvenid@, {{ nombre }}</span>
            <span class="text-xs text-white/75">{{ authStore.isAdmin ? 'Administrador' : 'Usuario' }}</span>
          </div>
        </div>

        <button @click="toggleTheme"
          class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
          <Sun v-if="isDark" class="size-5 text-amber-300" />
          <Moon v-else class="size-5" />
        </button>

        <button @click="logout"
          class="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 transition-colors">
          <LogOut class="size-4" />
          <span class="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Sun, Moon, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { logout } from '@/auth/session'

defineProps({
  titulo: { type: String, default: '' },
})

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const nombre = computed(() => authStore.user?.name?.toUpperCase() || '')
</script>
