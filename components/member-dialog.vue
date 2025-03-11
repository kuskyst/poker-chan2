<template>
  <v-dialog v-model="visible" class="w-75">
    <v-container width="100%" max-width="100%" class="pa-0">
      <v-table width="100%" max-width="100%" class="pa-4">
        <thead>
          <tr>
            <th class="border-e-sm border-md bg-green-accent-2" colspan="2">members</th>
          </tr>
          <tr>
            <th class="border-e-sm border-md bg-green-accent-1">name</th>
            <td class="border-md bg-green-accent-1">isVoted</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in room.members" :key="index">
            <th class="border-e-sm border-md">{{ member.name }}</th>
            <td class="border-md">{{ Object.keys(room.votes).includes(member.uuid) ? '○' : '×' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  room: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['update:show'])
const visible = ref(props.show)

watch(() => props.show, v => visible.value = v)
watch(visible, v => emit('update:show', v))

</script>
