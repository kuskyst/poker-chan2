export interface Member {
  name: string
  uuid: string
}

export interface Room {
  members: Member[]
  reveal: boolean
  title: string
  votes: Map<string, number>
}

export const newRoom = (): Room => {
  return{
    title: '',
    members: [],
    votes: new Map<string, number>(),
    reveal: false
  }
}
