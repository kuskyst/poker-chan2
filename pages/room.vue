<template>
  <div class="bg-green-lighten-3 h-100" width="100vh">
    <div class="bg-teal-accent-3 text-grey-darken-2 pt-2 pl-3 pr-3 text-h6">
      <v-row>
        <v-col cols="6" class="pb-0">
          <v-text-field
            append-inner-icon="mdi-check-bold"
            v-model="room.title"
            bg-color="white"
            label="title"
            variant="solo"
            clearable
            class="mb-2"
            hide-details
            @blur="sendMessage({title: room?.title})"
            @click:append-inner="sendMessage({title: room?.title})"
          />
        </v-col>
        <v-col class="pb-0 d-flex align-center">
          <v-icon class="mb-1 mr-2"
            :icon="player.status === 'CLOSED' ? 'mdi-connection'
            : player.status === 'OPEN' ? 'mdi-cast-connected'
            : 'mdi-transit-connection-variant'" />
            <v-btn class="ml-2 mb-2" icon="mdi-human-male-female-child" @click="player.memberDialog = true"></v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="4" class="pb-0">
          <v-text-field
            append-inner-icon="mdi-check-bold"
            v-model="player.name"
            bg-color="white"
            label="your name"
            variant="solo"
            class="mb-2"
            hide-details
            @blur="sendMessage({name: player.name})"
            @click:append-inner="sendMessage({name: player.name})"
          />
        </v-col>
        <v-col cols="auto" class="d-flex align-center mt-1 pa-0 mr-0">
          <v-btn
            color="blue"
            class="ml-2 mr-2"
            @click="room?.members.length > Object.keys(room?.votes).length ? player.confirmDialog = true : reveal()"
            prepend-icon="mdi-cards-playing"
            :disabled="room?.reveal || Object.keys(room?.votes).length == 0"
          >
            Reveal
          </v-btn>
          <v-btn color="red" class="ml-1" @click="reset" prepend-icon="mdi-delete" :disabled="Object.keys(room?.votes).length == 0">Reset</v-btn>
        </v-col>
        <v-col class="d-flex align-center mt-1 ml-6 pa-0">
          Avarage: {{ room.reveal ? player.average : '??' }}
        </v-col>
      </v-row>
    </div>

    <v-container class="pt-4 pr-0 pl-0">
      <v-sheet class="d-flex" @drop.prevent="onDrop" @dragover.prevent border="xl" rounded="xl" color="green-lighten-2 position-relative" width="100%" height="60vh">
        <v-card class="position-absolute top-0 left-0 bottom-0 right-0 bg-transparent ma-auto" border="surface-light lg" rounded="xl" width="80%" height="80%" />
        <v-row justify="start" style="max-height: calc(var(--v-space-md) * 2)" class="overflow-x-auto">
          <v-col cols="auto" class="text-white" v-for="([uuid, vote], index) in Object.entries(room?.votes)" :key="uuid" :style="votesStyle(index)">
            <score-card
              :open="room?.reveal"
              :score="vote"
              :class="{
                'bg-red-lighten-4': room?.reveal && Math.min(...Object.values(room?.votes).filter(v => v > 0)) == vote,
                'bg-blue-lighten-4': room?.reveal && Math.max(...Object.values(room?.votes)) == vote,
                'mb-1': room?.reveal
              }"
            />
            {{ room?.reveal ? room.members.filter(v => v.uuid === uuid.toString())[0]?.name : '' }}
          </v-col>
        </v-row>
      </v-sheet>
      <v-card
        class="position-absolute ml-10 d-inline rounded-circle d-flex justify-center align-center"
        color="teal-accent-1"
        :style="handsStyle(player.hands.length / 2, true)"
        width="65px"
        height="65px"
      >
        {{ Object.keys(room?.votes).length }} / {{ room?.members.length }}
      </v-card>
    </v-container>

    <v-row class="position-absolute left-0 right-0 bottom-0 pt-2 overflow-x-scroll flex-nowrap" justify="center">
      <v-col
        v-for="(hand, index) in player.hands"
        :key="index"
        cols="auto"
        class="d-flex justify-center"
      >
        <v-hover #default="{ isHovering, props }">
          <score-card
            v-bind="props"
            :style="handsStyle(index, isHovering ?? false)"
            draggable="true"
            class="ml-n6 mr-n6"
            :open="true"
            :score="hand"
            @dragstart="onDrag(hand, $event)"
            @click="play(hand)"
            :ripple="{ class: 'bg-green-accent-1' }"
            :class="{
              'bg-green-accent-2': player.score == hand,
              'text-white': player.score == hand
            }"
          />
        </v-hover>
      </v-col>
      <v-col cols="auto" class="d-flex justify-center">
        <v-hover #default="{ isHovering, props }">
          <v-card v-bind="props" height="130" width="90" class="ml-n6 mr-n6" :style="handsStyle(player.hands.length, isHovering ?? false)">
            <v-number-input flat hide-details inset v-model="player.drawScore" variant="solo" controlVariant="stacked" :max="99" :min="1" />
            <v-btn elevation="0" height="60%" width="100%" append-icon="mdi-credit-card-plus-outline" @click="draw(player.drawScore)" :ripple="{ class: 'bg-green-accent-1' }">draw</v-btn>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <confirm-dialog
      :show="player.confirmDialog"
      @update:show="player.confirmDialog = $event"
      :open="reveal"
    />
    <member-dialog
      :show="player.memberDialog"
      @update:show="player.memberDialog = $event"
      :room="room"
    />
  </div>
</template>

<script setup lang="ts">
import { StyleValue } from 'vue'
import colors from 'vuetify/util/colors'
import { useRoute } from 'vue-router'
import {
  room,
  player,
  sendMessage,
  play,
  draw,
  reset,
  reveal,
  initialize
} from '~/usecases/room-usecase'

initialize(useRoute().query.id as string)

const onDrag = (score: number, event: any) => event.dataTransfer.setData('score', JSON.stringify(score))
const onDrop = (event: any) => play(Number(event.dataTransfer.getData('score')))

const votesStyle = (index: number): StyleValue => {
  const random1 = Math.floor(Math.random() * (40 + 1 - 50)) + 50
  const random2 = Math.floor(Math.random() * (40 + 1 - 50)) + 50
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180
  return !room.value?.reveal ?
    {
      top: `${random1}%`,
      left: `${random2}%`,
      transform: `rotate(${random3}deg) translate(-${random1}%, -${random2}%)`,
      position: 'absolute',
      margin: 'auto',
      transition: 'all 0.3s ease',
      zIndex: index
    } :
    {
      transition: 'all 1s ease',
      transform: 'rotate(0deg) translate(0%, 0%)',
    }
}

const handsStyle = (index: number, isHovering: boolean): StyleValue => {
  let distance = player.value.hands.map((_, index) => index - Math.floor(player.value.hands.length / 2));
  distance.push(distance[distance.length - 1])
  return !isHovering ? {
    transform: `rotate(${distance[index] * 6}deg)`,
    marginTop: `${(distance[index] > 0 ? distance[index] : distance[index] * -1) * 10}px`,
    transition: 'all 0.3s ease',
    zIndex: index,
    border: `2px solid transparent`,
  } :
  {
    transform: `scale(1.3)`,
    transition: 'all 0.3s ease',
    zIndex: 99,
    border: `2px solid ${colors.green.accent2}`,
    boxShadow: `0 0 28px ${colors.green.accent2}`,
  }
}

</script>
