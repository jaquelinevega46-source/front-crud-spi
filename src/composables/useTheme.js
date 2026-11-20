import { ref, watch } from 'vue';

export const useTheme = () => {
  const isDark = ref(true);

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isDark.value = false;
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    applyTheme();
  });

  applyTheme();

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleTheme,
  };
};