<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white shadow">
      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold">Rinoimob</h1>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="bg-gray-100">
      <div class="px-6 py-4 text-center text-gray-600">
        <p>&copy; 2024 Rinoimob. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
