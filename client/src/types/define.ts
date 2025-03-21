export interface User {
    id: number
    username: string
}
  
export interface AuthState {
    isAuthenticated: boolean
    loading: boolean
    user: User | null
}

export type GameMode = 
    "solo" |
    "multiplayer" |
    "survival" |
    null;
