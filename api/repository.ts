import { useWebSocket } from '@vueuse/core'
import type { Message } from '~/api/entity/request'

const useWebSocketRepository = (id: string) => {
  const { data, send, status } = useWebSocket<MessageEvent>(`wss://poker-chan-api-production.up.railway.app/ws?id=${id}`, { autoReconnect: true })

  const sendMessage = (message: Message) => {
    send(JSON.stringify(message))
  }

  return {
    data,
    sendMessage,
    status
  }
}

export default useWebSocketRepository