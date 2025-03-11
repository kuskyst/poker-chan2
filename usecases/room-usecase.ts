import { ref, watch } from 'vue'
import useWebSocketRepository from '~/api/repository'
import type { Message } from '~/api/entity/request'
import { newPlayer } from '~/api/entity/player'
import { newRoom } from '~/api/entity/response'

const room = ref(newRoom())
const player = ref(newPlayer())

let repository: ReturnType<typeof useWebSocketRepository>

const initialize = (id: string) => {
  repository = useWebSocketRepository(id)
  const { data, status: wsStatus } = repository

  sendMessage({ name: player.value.name })

  watch(wsStatus, (wsStatus) => {
    player.value.status = wsStatus
  })

  watch(data, (message) => {
    player.value.status = player.value.status
    if (message) {
      room.value = JSON.parse(message.toString())
      if (Object.keys(room?.value?.votes).length <= 0) {
        player.value.score = 0
        player.value.confirmDialog = false
      }
      player.value.average = (Object.values(room.value.votes).filter(v => v > 0).map(parseFloat)
        .reduce((sum, element) => sum + element, 0)) / Object.values(room.value.votes).filter(v => v > 0).length
    }
  })
}

const sendMessage = (message: Message) => {
  repository.sendMessage(message)
}

const play = (card: number) => {
  if (!room.value?.reveal && !isNaN(card)) {
    player.value.score = card
    sendMessage({ vote: String(player.value.score) })
  }
}

const draw = (card: number) => {
  if (!player.value.hands.includes(card)) {
    player.value.hands.push(card)
    player.value.hands.sort((a, b) => a - b)
  }
}

const reset = () => sendMessage({ reset: true })
const reveal = () => sendMessage({ reveal: true })

export {
  room,
  player,
  sendMessage,
  play,
  draw,
  reset,
  reveal,
  initialize
}
