<template>
  <button class="glass-btn">
    <slot />
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped>
.glass-btn {
  padding: 0.5rem 1rem;
  background: rgba(0, 102, 255, 0.15);
  border: 1px solid rgba(0, 102, 255, 0.3);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.glass-btn:hover {
  background: rgba(0, 102, 255, 0.25);
  border-color: rgba(0, 102, 255, 0.5);
}
</style>
