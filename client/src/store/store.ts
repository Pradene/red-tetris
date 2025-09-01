import { configureStore } from "@reduxjs/toolkit"
import authReducer from './authReducer'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
})

// Infer types for dispatch and state
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
