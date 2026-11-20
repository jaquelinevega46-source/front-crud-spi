# front-crud-spi

Front del CRUD-SPI en Vue 3 + JavaScript

## Stack
Vite 7 · Vue 3 · Vue Router · Pinia · Tailwind 4 · shadcn-vue (reka-ui) · Zod · vue-sonner · lucide

## Correr
```bash
cp .env.example .env      # VITE_API_BASE=http://localhost:4001/api
pnpm install
pnpm dev                  # http://localhost:3000
```

## Estructura
```
src/
├── api/                  # llamadas HTTP → { ok, data, message }
├── auth/                 # logout()
├── components/ui/        # shadcn-vue
├── components/           # AppHeader, AppFooter
├── components/usuarios/  # UsuarioFormDialog
├── composables/          # useTheme, useFormValidation
├── layouts/              # AppLayout
├── lib/                  # cn()
├── plugins/axios.js      # axios + header x-api-token
├── router/               # rutas con meta y guard de sesión
├── schemas/              # validaciones zod
├── stores/auth.js        # sesión (token JWT + usuario)
└── views/
```

## Actividades pendientes
La lista de tareas para continuar el proyecto está en el README del back: [../BackEnd-CRUD/README.md](../BackEnd-CRUD/README.md#actividades-pendientes).

## Cómo entregar las actividades
Cada actividad se entrega con un fork, una rama y un Pull Request con gitmoji. La guía completa está en [../BackEnd-CRUD/README.md](../BackEnd-CRUD/README.md#cómo-entregar-las-actividades).
