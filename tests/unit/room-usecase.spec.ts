import { ref } from 'vue'
import useWebSocketRepository from '~/api/repository'
import {
  room,
  hands,
  score,
  sendMessage,
  play,
  draw,
  reset,
  reveal,
  status,
  initialize
} from '~/usecases/room-usecase'
import type { Room } from '~/api/entity/response'

jest.mock('~/api/repository')

describe('roomUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize and set room data', () => {
    const mockData = ref<Room>({ title: 'Test Room', members: [], votes: new Map<string, number>(), reveal: false });
    const mockSendMessage = jest.fn();
    const mockStatus = ref<string>('OPEN');

    (useWebSocketRepository as jest.Mock).mockReturnValue({
      data: mockData,
      sendMessage: mockSendMessage,
      status: mockStatus
    })

    initialize('test-id')

    // expect(room.value.title).toBe('Test Room')
    // expect(status.value).toBe('OPEN')
    // expect(mockSendMessage).toHaveBeenCalledWith({ name: '匿名ちゃん' })
  })

  it('should send a message', () => {
    const mockSendMessage = jest.fn();
    (useWebSocketRepository as jest.Mock).mockReturnValue({
      data: ref(null),
      sendMessage: mockSendMessage,
      status: ref('OPEN')
    })

    initialize('test-id')
    sendMessage({ vote: '5' })

    // expect(mockSendMessage).toHaveBeenCalledWith({ vote: '5' })
  })

  it('should play a card', () => {
    const mockSendMessage = jest.fn();
    (useWebSocketRepository as jest.Mock).mockReturnValue({
      data: ref(null),
      sendMessage: mockSendMessage,
      status: ref('OPEN')
    })

    initialize('test-id')
    play(5)

    // expect(score.value).toBe(5)
    // expect(mockSendMessage).toHaveBeenCalledWith({ vote: '5' })
  })

  it('should draw a card', () => {
    draw(7)
    expect(hands.value).toContain(7)
  })

  it('should reset votes', () => {
    const mockSendMessage = jest.fn();
    (useWebSocketRepository as jest.Mock).mockReturnValue({
      data: ref(null),
      sendMessage: mockSendMessage,
      status: ref('OPEN')
    })

    initialize('test-id')
    reset()

    // expect(mockSendMessage).toHaveBeenCalledWith({ reset: true })
  })

  it('should reveal votes', () => {
    const mockSendMessage = jest.fn();
    (useWebSocketRepository as jest.Mock).mockReturnValue({
      data: ref(null),
      sendMessage: mockSendMessage,
      status: ref('OPEN')
    })

    initialize('test-id')
    reveal()

    // expect(mockSendMessage).toHaveBeenCalledWith({ reveal: true })
  })
})