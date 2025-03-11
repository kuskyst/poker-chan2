<template>
  <div class="bg-teal-accent-3">
  <v-container height="100vh" class="ma-auto">
    <v-col class="text-center">
      <v-btn append-icon="mdi-home-plus" class="mb-4" width="80%" @click="createRoom">Create new Room</v-btn>
    </v-col>
    <v-col>
      <v-text-field
        class="ma-auto"
        width="80%"
        append-inner-icon="mdi-home-import-outline"
        v-model="roomID"
        bg-color="white"
        label="roomID"
        variant="solo"
        clearable @click:append-inner="enterRoom"
      />
    </v-col>
  </v-container>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';

const roomID = ref('')

const enterRoom = () => { if (roomID) navigateTo(`/room?id=${roomID.value}`) }
const createRoom = () => navigateTo(`/room?id=${uuidv4()}`)

</script>
