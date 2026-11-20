<template>
  <footer class="bg-gradient-brand text-white">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-5 text-center">
      <p class="text-base font-bold tracking-wide">CRUD-SPI</p>
      <p class="text-xs text-white/80">
        Desarrollado por Alexis Rocandio · {{ anio }}
      </p>
      <p class="text-xs text-white/80">
        CRUD - <span class="underline underline-offset-2">SPI</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
const anio = new Date().getFullYear()
</script>
