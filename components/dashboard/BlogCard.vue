<script setup lang="ts">
import {
  ClockHour4Icon,
  MessageCircle2Icon,
  MessageCircleIcon,
} from 'vue-tabler-icons';
</script>

<template>
  <VCard elevation="10" class="overflow-hidden">
    <img style="width: 100%" src="/images/backgrounds/u5.jpg" />
    <v-card-text class="pa-7">
      <h3 class="text-h6 d-flex align-center">
        <ClockHour4Icon class="mr-1" size="20" />
        22 марта 2022
      </h3>
      <h5 class="mb-2 mt-5 text-h5">
        Супер круто, Vue 3 уже здесь, давайте сделаем это!
      </h5>
      <v-chip class="mr-2" label size="small" color="primary"> Средний </v-chip>
      <v-chip class="mr-2" label size="small" color="error"> Низкий </v-chip>
      <v-divider class="mt-7"></v-divider>
      <div class="d-flex align-center mt-4">
        <v-avatar size="40">
          <img width="40" src="/images/profile/1.jpg" alt="Джон" />
        </v-avatar>
        <v-avatar size="40" class="ml-2">
          <img width="40" src="/images/profile/2.jpg" alt="Джон" />
        </v-avatar>
        <v-avatar size="40" class="ml-2">
          <img width="40" src="/images/profile/3.jpg" alt="Джон" />
        </v-avatar>
        <div class="ml-auto">
          <v-btn icon variant="flat">
            <v-avatar size="large" class="textSecondary">
              <MessageCircle2Icon size="22" />
            </v-avatar>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </VCard>
</template>
