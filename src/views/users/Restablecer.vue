<template>
  <div
    class="relative flex-1 flex flex-col items-center justify-start px-4 pt-10 pb-12 bg-white dark:bg-slate-900 transition-colors">
    <div class="absolute top-4 right-4">
      <button @click="toggleTheme"
        class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
        <Sun v-if="isDark" class="w-5 h-5 text-amber-500" />
        <Moon v-else class="w-5 h-5 text-slate-600" />
      </button>
    </div>

    <div class="flex flex-col items-center gap-3 mb-8 mt-8">
      <div class="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-brand">
        <KeyRound class="size-7" />
      </div>
      <h1 class="text-2xl font-semibold text-theme-primary">Nueva contraseña</h1>
    </div>

    <Card class="w-full max-w-sm">
      <CardContent class="pt-6">
        <form class="grid gap-4" @submit.prevent="handleReset">
          <div class="space-y-1.5">
            <Label for="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              v-model="form.password"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="space-y-1.5">
            <Label for="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              v-model="form.confirmPassword"
              autocomplete="new-password"
              required
            />
          </div>

          <p v-if="errorMsg" class="text-xs text-red-500">
            {{ errorMsg }}
          </p>

          <Button class="w-full mt-2" type="submit" :disabled="loading">
            <span v-if="loading">Guardando...</span>
            <span v-else>Restablecer contraseña</span>
          </Button>
        </form>

        <p class="text-sm text-muted-foreground text-center mt-4">
          <RouterLink :to="{ name: 'login' }" class="text-primary hover:underline">
            Volver al inicio de sesión
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Sun, Moon, KeyRound } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { restablecerContrasenia } from '@/api/usuario'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const loading = ref(false)
const errorMsg = ref('')
const form = reactive({
  password: '',
  confirmPassword: '',
})

const handleReset = async () => {
  errorMsg.value = ''

  if (form.password.length < 6) {
    errorMsg.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  const res = await restablecerContrasenia(route.params.token, form.password)
  loading.value = false

  if (!res.ok) {
    errorMsg.value = res.message
    toast.error(res.message)
    return
  }

  toast.success(res.data.message || 'Contraseña actualizada correctamente')
  router.push({ name: 'login' })
}
</script>