<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ esEdicion ? 'Editar usuario' : 'Nuevo usuario' }}</DialogTitle>
        <DialogDescription>
          {{ esEdicion
            ? 'Actualiza los datos. Deja la contraseña vacía para no cambiarla.'
            : 'Captura los datos del nuevo usuario.' }}
        </DialogDescription>
      </DialogHeader>

      <form id="usuario-form" class="grid gap-4" @submit.prevent="handleSubmit">
        <div class="space-y-1.5">
          <Label for="u-nombre">Nombre</Label>
          <Input id="u-nombre" v-model="form.nombre" placeholder="Nombre" maxlength="100"
            @blur="onBlur('nombre')" @input="onInput('nombre')" :aria-invalid="!!getFieldError('nombre')" />
          <p v-if="getFieldError('nombre')" class="text-xs text-red-500">{{ getFieldError('nombre') }}</p>
        </div>

        <div class="space-y-1.5">
          <Label for="u-correo">Correo</Label>
          <Input id="u-correo" type="email" v-model.trim="form.correo" placeholder="correo@ejemplo.com" maxlength="150"
            @blur="onBlur('correo')" @input="onInput('correo')" :aria-invalid="!!getFieldError('correo')" />
          <p v-if="getFieldError('correo')" class="text-xs text-red-500">{{ getFieldError('correo') }}</p>
        </div>

        <div class="space-y-1.5">
          <Label for="u-contrasenia">{{ esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña' }}</Label>
          <Input id="u-contrasenia" type="password" v-model="form.contrasenia" placeholder="••••••"
            autocomplete="new-password"
            @blur="onBlur('contrasenia')" @input="onInput('contrasenia')"
            :aria-invalid="!!getFieldError('contrasenia')" />
          <p v-if="getFieldError('contrasenia')" class="text-xs text-red-500">{{ getFieldError('contrasenia') }}</p>
        </div>

        <div v-if="!esEdicion" class="space-y-1.5">
          <Label for="u-rol">Rol</Label>
          <select id="u-rol" v-model="form.rol"
            class="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30">
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </form>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Cancelar</Button>
        <Button type="submit" form="usuario-form" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { crearUsuario, actualizarUsuario } from '@/api/usuario'
import { useFormValidation } from '@/composables/useFormValidation'
import { registroSchema, editarUsuarioSchema } from '@/schemas/usuarioSchema'

const props = defineProps({
  open: { type: Boolean, default: false },
  usuario: { type: Object, default: null },
})
const emit = defineEmits(['update:open', 'guardado'])

const esEdicion = computed(() => !!props.usuario)

const validadores = {
  crear: useFormValidation(registroSchema),
  editar: useFormValidation(editarUsuarioSchema),
}
const v = computed(() => (esEdicion.value ? validadores.editar : validadores.crear))
const getFieldError = (campo) => v.value.getFieldError(campo)

const guardando = ref(false)
const form = reactive({ nombre: '', correo: '', contrasenia: '', rol: 'user' })

watch(
  () => props.open,
  (abierto) => {
    if (!abierto) return
    v.value.clearErrors()
    Object.assign(form, {
      nombre: props.usuario?.name ?? '',
      correo: props.usuario?.email ?? '',
      contrasenia: '',
      rol: props.usuario?.role ?? 'user',
    })
  }
)

const onBlur = (campo) => {
  v.value.markAsTouched(campo)
  v.value.validateField(campo, form)
}
const onInput = (campo) => v.value.validateField(campo, form)

const handleSubmit = async () => {
  ;['nombre', 'correo', 'contrasenia'].forEach(v.value.markAsTouched)
  if (!(await v.value.validateAll(form))) return

  guardando.value = true
  const res = esEdicion.value
    ? await actualizarUsuario(props.usuario.id, form)
    : await crearUsuario(form)
  guardando.value = false

  if (!res.ok) {
    toast.error(res.message)
    return
  }

  toast.success(res.data.message)
  emit('update:open', false)
  emit('guardado')
}
</script>
