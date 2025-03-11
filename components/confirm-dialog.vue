<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-card>
      <v-card-title class="text-center">
        <v-icon class="ml-2 mr-2" icon="mdi-cards" color="blue" />
        <v-icon class="ml-2 mr-2" icon="mdi-alert" color="red" />
        <v-icon class="ml-2 mr-2" icon="mdi-cards" color="blue" />
      </v-card-title>
      <v-card-text class="text-center font-weight-bold">まだ全員のカードが出てないけど開けちゃう？</v-card-text>
      <v-card-actions class="mx-auto">
        <v-btn color="blue" @click="visible = false" class="font-weight-bold">Cancel</v-btn>
        <v-spacer />
        <v-btn color="red" @click="visible = false;open();" class="font-weight-bold">Reveal</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  open: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['update:show'])
const visible = ref(props.show)

watch(() => props.show, v => visible.value = v)
watch(visible, v => emit('update:show', v))

</script>
