import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../types/define'

const initialState: AuthState = {
    isAuthenticated: false,
    loading: true,
    user: null,
}

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated(state, action: PayloadAction<User>) {
            state.isAuthenticated = true
            state.user = action.payload
            state.loading = false
        },
        setUnauthenticated(state) {
            state.isAuthenticated = false
            state.user = null
            state.loading = false
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
    },
})

export const { setAuthenticated, setUnauthenticated, setLoading } = authReducer.actions

export default authReducer.reducer