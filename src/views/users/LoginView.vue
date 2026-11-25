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
        <Users class="size-7" />
      </div>
      <h1 class="text-2xl font-semibold text-theme-primary">CRUD-SPI</h1>
    </div>

    <Card class="w-full max-w-sm">
      <CardContent class="pt-6">
        <form class="grid gap-4" @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="Correo" v-model.trim="formLogin.correo"
              @blur="onBlur('correo')" @input="onInput('correo')"
              :aria-invalid="!!getFieldError('correo')" maxlength="150" autocomplete="email" />
            <p v-if="getFieldError('correo')" class="text-xs text-red-500">
              {{ getFieldError('correo') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <Label for="password">Contraseña</Label>
              <button
                type="button"
                @click="abrirModalRecuperacion"
                class="text-xs text-primary hover:underline font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Input id="password" type="password" placeholder="Contraseña" v-model="formLogin.contrasenia"
              @blur="onBlur('contrasenia')" @input="onInput('contrasenia')"
              :aria-invalid="!!getFieldError('contrasenia')" autocomplete="current-password" />
            <p v-if="getFieldError('contrasenia')" class="text-xs text-red-500">
              {{ getFieldError('contrasenia') }}
            </p>
          </div>

          <Button class="w-full mt-2" type="submit" :disabled="loading">
            <span v-if="loading">Iniciando...</span>
            <span v-else>Iniciar sesión</span>
          </Button>
        </form>

        <p class="text-sm text-muted-foreground text-center mt-4">
          ¿No tienes cuenta?
          <RouterLink :to="{ name: 'registro' }" class="text-primary hover:underline">Regístrate</RouterLink>
        </p>
      </CardContent>
    </Card>

    <!-- Modal de Recuperación de Contraseña -->
    <Dialog v-model:open="modalForgotAbierto">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace válido por 30 minutos para restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleForgotPassword" class="space-y-4 pt-2">
          <div class="space-y-1.5">
            <Label for="forgot-email">Correo electrónico</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="correo@ejemplo.com"
              v-model.trim="forgotEmail"
              required
              autocomplete="email"
            />
          </div>

          <DialogFooter class="gap-2 sm:gap-0">
            <Button type="button" variant="outline" @click="modalForgotAbierto = false">
              Cancelar
            </Button>
            <Button type="submit" :disabled="loadingForgot || !forgotEmail">
              <span v-if="loadingForgot">Enviando...</span>
              <span v-else>Enviar enlace</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sun, Moon, Users } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { solicitarRecuperacion } from '@/api/usuario'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { useFormValidation } from '@/composables/useFormValidation'
import { loginSchema } from '@/schemas/usuarioSchema'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const { getFieldError, markAsTouched, validateField, validateAll } = useFormValidation(loginSchema)

const loading = ref(false)
const formLogin = reactive({ correo: '', contrasenia: '' })

const modalForgotAbierto = ref(false)
const forgotEmail = ref('')
const loadingForgot = ref(false)

onMounted(() => {
  if (sessionStorage.getItem('sessionExpired')) {
    sessionStorage.removeItem('sessionExpired')
    toast.warning('Tu sesión expiró, inicia sesión de nuevo')
  }
})

const onBlur = (campo) => {
  markAsTouched(campo)
  validateField(campo, formLogin)
}
const onInput = (campo) => validateField(campo, formLogin)

const abrirModalRecuperacion = () => {
  forgotEmail.value = formLogin.correo || ''
  modalForgotAbierto.value = true
}

const handleForgotPassword = async () => {
  if (!forgotEmail.value) return

  loadingForgot.value = true
  const res = await solicitarRecuperacion(forgotEmail.value)
  loadingForgot.value = false

  if (!res.ok) {
    toast.error(res.message)
    return
  }

  toast.success(res.data.message)
  modalForgotAbierto.value = false
}

const handleLogin = async () => {
  Object.keys(formLogin).forEach(markAsTouched)
  if (!(await validateAll(formLogin))) return

  loading.value = true
  const res = await authStore.login(formLogin.correo, formLogin.contrasenia)
  loading.value = false

  if (!res.ok) {
    toast.error(res.message)
    return
  }

  toast.success(`Bienvenid@, ${authStore.user.name}`)
  router.push({ name: 'usuarios' })
}
</script>