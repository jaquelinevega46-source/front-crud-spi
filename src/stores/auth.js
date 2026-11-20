import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { loginUsuario } from "@/api/usuario";

const limpiarSesion = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("tokenExpiresAt");
  sessionStorage.removeItem("usuario");
};

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const isAdmin = computed(() => user.value?.role === "admin");

  const isTokenExpired = () => {
    const expiresAt = Number(sessionStorage.getItem("tokenExpiresAt"));
    if (!expiresAt) return true;
    return expiresAt < Date.now();
  };

  const initAuth = () => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("usuario");

    if (!savedToken || !savedUser || isTokenExpired()) {
      limpiarSesion();
      return;
    }

    try {
      user.value = JSON.parse(savedUser);
      token.value = savedToken;
    } catch {
      limpiarSesion();
    }
  };

  let authReady = false;
  const ensureAuthReady = () => {
    if (!authReady) {
      initAuth();
      authReady = true;
    }
  };

  const login = async (correo, contrasenia) => {
    const res = await loginUsuario(correo, contrasenia);
    if (!res.ok) return { ok: false, message: res.message };

    const { token: newToken, tokenExpiresAt, user: usuario } = res.data;

    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("tokenExpiresAt", tokenExpiresAt);
    sessionStorage.setItem("usuario", JSON.stringify(usuario));

    token.value = newToken;
    user.value = usuario;

    return { ok: true };
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    limpiarSesion();
    router.replace({ name: "login" });
  };

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    isAdmin,
    isTokenExpired,
    initAuth,
    ensureAuthReady,
    login,
    logout,
  };
});
