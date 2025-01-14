<script setup lang="ts"></script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Props -->
  <!-- ----------------------------------------------------------------------------- -->
  <v-card elevation="0">
    <template v-slot:title> Это заголовок </template>

    <template v-slot:subtitle> Это подзаголовок </template>

    <template v-slot:text> Это содержимое </template>
  </v-card>
</template>
