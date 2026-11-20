import { useAuthStore } from '@/stores/auth';

export const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();
};
