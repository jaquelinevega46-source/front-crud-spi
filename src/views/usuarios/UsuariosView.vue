<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-theme-primary">Usuarios registrados</h1>
          <p class="text-sm text-theme-muted">
            {{ usuarios.length }} {{ usuarios.length === 1 ? 'usuario' : 'usuarios' }} en el sistema
          </p>
        </div>

        <div class="flex gap-2">
          <div class="relative flex-1 sm:w-64">
            <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-theme-muted" />
            <Input v-model="busqueda" placeholder="Buscar por nombre o correo" class="pl-9" />
          </div>
          <Button v-if="authStore.isAdmin" @click="abrirCrear">
            <Plus class="size-4" />
            <span class="hidden sm:inline">Nuevo</span>
          </Button>
        </div>
      </div>

      <Card class="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-16 pl-4">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead v-if="authStore.isAdmin" class="text-right pr-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty v-if="loading" :colspan="columnas">Cargando usuarios...</TableEmpty>
            <TableEmpty v-else-if="!usuariosFiltrados.length" :colspan="columnas">
              {{ busqueda ? 'Sin resultados para la búsqueda' : 'No hay usuarios registrados' }}
            </TableEmpty>

            <template v-else>
            <TableRow v-for="usuario in usuariosFiltrados" :key="usuario.id">
              <TableCell class="pl-4 text-theme-muted">{{ usuario.id }}</TableCell>
              <TableCell class="font-medium">
                {{ usuario.name }}
                <span v-if="usuario.id === authStore.user?.id" class="ml-1 text-xs text-theme-muted">(tú)</span>
              </TableCell>
              <TableCell>{{ usuario.email }}</TableCell>
              <TableCell>
                <span :class="usuario.role === 'admin' ? 'badge-info' : 'badge-success'">
                  {{ usuario.role === 'admin' ? 'Administrador' : 'Usuario' }}
                </span>
              </TableCell>
              <TableCell v-if="authStore.isAdmin" class="text-right pr-4">
                <Button variant="ghost" size="icon-sm" title="Editar" @click="abrirEditar(usuario)">
                  <Pencil class="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" title="Eliminar" class="text-destructive"
                  :disabled="usuario.id === authStore.user?.id" @click="usuarioAEliminar = usuario">
                  <Trash2 class="size-4" />
                </Button>
              </TableCell>
            </TableRow>
            </template>
          </TableBody>
        </Table>
      </Card>
    </div>

    <UsuarioFormDialog v-model:open="dialogForm" :usuario="usuarioEnEdicion" @guardado="cargarUsuarios" />

    <AlertDialog :open="!!usuarioAEliminar" @update:open="(abierto) => !abierto && (usuarioAEliminar = null)">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará a <strong>{{ usuarioAEliminar?.name }}</strong> ({{ usuarioAEliminar?.email }}).
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant="destructive" :disabled="eliminando" @click="confirmarEliminar">
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Pencil, Plus, Search, Trash2 } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import UsuarioFormDialog from '@/components/usuarios/UsuarioFormDialog.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { obtenerUsuarios, eliminarUsuario } from '@/api/usuario'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const usuarios = ref([])
const loading = ref(false)
const busqueda = ref('')

const dialogForm = ref(false)
const usuarioEnEdicion = ref(null)

const usuarioAEliminar = ref(null)
const eliminando = ref(false)

const columnas = computed(() => (authStore.isAdmin ? 5 : 4))

const usuariosFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return usuarios.value
  return usuarios.value.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

const cargarUsuarios = async () => {
  loading.value = true
  const res = await obtenerUsuarios()
  loading.value = false

  if (!res.ok) {
    toast.error(res.message)
    return
  }
  usuarios.value = res.data
}

const abrirCrear = () => {
  usuarioEnEdicion.value = null
  dialogForm.value = true
}

const abrirEditar = (usuario) => {
  usuarioEnEdicion.value = usuario
  dialogForm.value = true
}

const confirmarEliminar = async () => {
  eliminando.value = true
  const res = await eliminarUsuario(usuarioAEliminar.value.id)
  eliminando.value = false

  if (!res.ok) {
    toast.error(res.message)
    return
  }

  toast.success(res.data.message)
  usuarioAEliminar.value = null
  cargarUsuarios()
}

onMounted(cargarUsuarios)
</script>
