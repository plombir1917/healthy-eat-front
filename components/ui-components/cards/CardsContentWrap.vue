<script setup lang="ts">
import { ref } from 'vue';

const messages = ref([
  {
    from: 'Вы',
    message: `Конечно, увидимся позже.`,
    time: '10:42am',
    color: 'primary',
  },
  {
    from: 'Джон Доу',
    message: 'Да, конечно. Подходит ли 1:00pm?',
    time: '10:37am',
    color: 'secondary',
  },
  {
    from: 'Вы',
    message: 'Вы все еще хотите перекусить сегодня?',
    time: '9:47am',
    color: 'success',
  },
]);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Content Wrap -->
  <!-- ----------------------------------------------------------------------------- -->
  <div class="pa-3">
    <v-row justify="space-around">
      <v-card elevation="0">
        <v-img
          height="200"
          src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
          cover
          class="text-white"
        >
          <v-layout full-height>
            <v-app-bar
              density="comfortable"
              color="rgba(0, 0, 0, 0)"
              flat
              theme="dark"
            >
              <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
              </template>

              <v-toolbar-title class="text-h6"> Сообщения </v-toolbar-title>

              <template v-slot:append>
                <v-icon icon="mdi-dots-vertical"></v-icon>
              </template>
            </v-app-bar>
          </v-layout>
        </v-img>

        <v-card-text>
          <div class="font-weight-bold ml-1 mb-2">Сегодня</div>

          <v-timeline density="compact">
            <v-timeline-item
              v-for="message in messages"
              :key="message.time"
              :dot-color="message.color"
              size="x-small"
            >
              <div class="mb-4">
                <div class="font-weight-normal">
                  <strong>{{ message.from }}</strong> @{{ message.time }}
                </div>
                <div>{{ message.message }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>
