<template>
  <v-card v-if="score > 0" height="130" width="90">
    <v-card-title class="text-end">{{ open ? score : '??' }}</v-card-title>
    <v-card-subtitle class="text-center">
      <v-icon :icon="score % 2 == 0 ? 'mdi-cards-spade' : 'mdi-cards-spade-outline'" />
      <v-icon :icon="score % 2 == 0 ? 'mdi-cards-heart' : 'mdi-cards-heart-outline'" />
      <br>
      <v-icon :icon="score % 2 == 0 ? 'mdi-cards-club-outline' : 'mdi-cards-club'" />
      <v-icon :icon="score % 2 == 0 ? 'mdi-cards-diamond-outline' : 'mdi-cards-diamond'" />
    </v-card-subtitle>
    <v-card-title class="text-start">{{ open ? score : '??' }}</v-card-title>
  </v-card>
  <v-card v-else height="130" width="90" class="d-flex align-center justify-center">☕</v-card>
</template>

<script setup lang="ts">
defineProps<{
  score: number,
  open: boolean
}>()
</script>