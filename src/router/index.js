import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "@/views/users/LoginView.vue";
import NotFoundRouter from "@/views/share/NotFoundRouter.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
      meta: { title: "Iniciar Sesión | CRUD-SPI", guestOnly: true },
    },
    {
      path: "/registro",
      name: "registro",
      component: () => import("@/views/users/RegistroPasswordView.vue"),
      meta: { title: "Registro | CRUD-SPI", guestOnly: true },
    },
    {
      path: "/registro",
      name: "registro",
      component: () => import("@/views/users/RegistroPasswordView.vue"),
      meta: { title: "Registro | CRUD-SPI", guestOnly: true},
    },
    {
      path: "/restablecer/:token",
      name: "restablecer-password",
      component: () => import("@/views/users/Restablecer.vue"),
      meta: { title: "RESTABLECER CONTRASEÑA | CRUD-SPI", guestOnly: true},
    },
    {
      path: "/admin/usuarios",
      name: "admin-usuarios",
      component: () => import("@/views/usuarios/UsuariosView.vue"),
      meta: {title: "Administracion de Usuarios | CRUD-SPI", requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/usuario",
      name: "usuario-perfil",
      component: () => import("@/views/usuarios/PerfilUsuarioView.vue"),
      meta:{ title: "MI PERFIL | CRUD-SPI", requiresAuth: true},
    },
    {
      path: "/usuarios",
      redirect: () => {
        const authStore = useAuthStore();
        authStore.ensureAuthReady();
        return authStore.isAdmin ? "/admin/usuarios" : "/usuario";
      },
    },
    {
      path: "/admin/:pathMatch(.*)*",
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: "/admin/usuarios",
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundRouter,
      meta: { title: "Página no encontrada", requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title;
  }

  const authStore = useAuthStore();
  authStore.ensureAuthReady();

  if (to.meta.requiresAuth && authStore.isAuthenticated && authStore.isTokenExpired()) {
    sessionStorage.setItem("sessionExpired", "true");
    authStore.logout();
    return next({ name: "login" });
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login" });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: "usuarios" });
  }
  //Admin
  if(to.meta.requiresAdmin) {
    const esAdminReal = await authStore.verificarRolServidor();
    if(!esAdminReal) {
      toast.error("NO TIENES PERMISOS DE ADMINISTRADOR");
      return next({ name: "usuario-perfil"});
    }
  }
  next();
});

router.onError((error, to) => {
  const esErrorDeChunk = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(error.message)

  if (esErrorDeChunk) {
    const yaRecargo = sessionStorage.getItem('chunk-reload-attempted')

    if (!yaRecargo) {
      sessionStorage.setItem('chunk-reload-attempted', 'true')
      window.location.href = to.fullPath
    } else {
      sessionStorage.removeItem('chunk-reload-attempted')
    }
  }
})

export default router;
