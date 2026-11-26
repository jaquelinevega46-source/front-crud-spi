<template>
  <AppLayout>
    <div class="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-theme-primary">Mi perfil</h1>
        <p class="text-sm text-theme-muted">
          Información de tu cuenta en CRUD-SPI
        </p>
      </div>

      <Card class="p-6 space-y-5">
        <div class="flex items-center justify-between border-b pb-4">
          <div class="flex items-center gap-3">
            <div class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
              {{ iniciales }}
            </div>
            <div>
              <h2 class="text-lg font-semibold text-theme-primary">{{ authStore.user?.name }}</h2>
              <p class="text-sm text-theme-muted">{{ authStore.user?.email }}</p>
            </div>
          </div>

          <span :class="authStore.isAdmin ? 'badge-info' : 'badge-success'">
            {{ authStore.isAdmin ? 'Administrador' : 'Usuario' }}
          </span>
        </div>

        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt class="text-theme-muted">ID de usuario</dt>
            <dd class="mt-1 font-medium text-theme-primary">#{{ authStore.user?.id }}</dd>
          </div>
          <div>
            <dt class="text-theme-muted">Rol asignado</dt>
            <dd class="mt-1 font-medium text-theme-primary">
              {{ authStore.isAdmin ? 'Administrador' : 'Usuario estándar' }}
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-theme-muted">Correo electrónico</dt>
            <dd class="mt-1 font-medium text-theme-primary">{{ authStore.user?.email }}</dd>
          </div>
        </dl>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const iniciales = computed(() => {
  const nombre = authStore.user?.name?.trim() || 'U'
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
})
</script>