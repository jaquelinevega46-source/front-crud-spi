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
        <UserPlus class="size-7" />
      </div>
      <h1 class="text-2xl font-semibold text-theme-primary">Crea una cuenta</h1>
    </div>

    <Card class="w-full max-w-sm">
      <CardContent class="pt-6">
        <form class="grid gap-4" @submit.prevent="handleRegistro">
          <div v-for="campo in campos" :key="campo.key" class="space-y-1.5">
            <Label :for="campo.key">{{ campo.label }}</Label>
            <Input :id="campo.key" :type="campo.type" :placeholder="campo.label" v-model="form[campo.key]"
              @blur="onBlur(campo.key)" @input="onInput(campo.key)"
              :aria-invalid="!!getFieldError(campo.key)" :autocomplete="campo.autocomplete" />
            <p v-if="getFieldError(campo.key)" class="text-xs text-red-500">
              {{ getFieldError(campo.key) }}
            </p>
          </div>

          <Button class="w-full mt-2" type="submit" :disabled="loading">
            <span v-if="loading">Registrando...</span>
            <span v-else>Registrarse</span>
          </Button>
        </form>

        <p class="text-sm text-muted-foreground text-center mt-4">
          ¿Ya tienes cuenta?
          <RouterLink :to="{ name: 'login' }" class="text-primary hover:underline">Inicia sesión</RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sun, Moon, UserPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { crearUsuario } from '@/api/usuario'
import { useTheme } from '@/composables/useTheme'
import { useFormValidation } from '@/composables/useFormValidation'
import { registroSchema } from '@/schemas/usuarioSchema'

const campos = [
  { key: 'nombre', label: 'Nombre', type: 'text', autocomplete: 'name' },
  { key: 'correo', label: 'Correo', type: 'email', autocomplete: 'email' },
  { key: 'contrasenia', label: 'Contraseña', type: 'password', autocomplete: 'new-password' },
]

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const { getFieldError, markAsTouched, validateField, validateAll } = useFormValidation(registroSchema)

const loading = ref(false)
const form = reactive({ nombre: '', correo: '', contrasenia: '' })

const onBlur = (campo) => {
  markAsTouched(campo)
  validateField(campo, form)
}
const onInput = (campo) => validateField(campo, form)

const handleRegistro = async () => {
  Object.keys(form).forEach(markAsTouched)
  if (!(await validateAll(form))) return

  loading.value = true
  const res = await crearUsuario(form)
  loading.value = false

  if (!res.ok) {
    toast.error(res.message)
    return
  }

  toast.success('Cuenta creada. Ya puedes iniciar sesión')
  router.push({ name: 'login' })
}
</script>
