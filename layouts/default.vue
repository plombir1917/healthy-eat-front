<template>
  <div class="min-h-screen bg-background dark:bg-gray-900 font-sans">
    <Navbar />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Sidebar from '~/components/Sidebar.vue';
</script>
