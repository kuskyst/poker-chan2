export interface Player {
  name: string,
  score?: number,
  hands: number[],
  average: number,
  drawScore: number,
  status: string,
  confirmDialog: boolean,
  memberDialog: boolean
}

export const newPlayer = (): Player => {
  return {
    name: '匿名ちゃん',
    hands: [-1, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100],
    average: 0,
    drawScore: 10,
    status: 'connecting',
    confirmDialog: false,
    memberDialog: false
  }
}