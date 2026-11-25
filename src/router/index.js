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
      path: "/usuarios",
      name: "usuarios",
      component: () => import("@/views/usuarios/UsuariosView.vue"),
      meta: { title: "Usuarios", requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundRouter,
      meta: { title: "Página no encontrada", requiresAuth: false },
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
  ],
});

router.beforeEach((to, _from, next) => {
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

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: "usuarios" });
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
