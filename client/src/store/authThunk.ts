import { createAsyncThunk } from "@reduxjs/toolkit"
import { tokenRequest } from "../api/auth"
import { setAuthenticated, setUnauthenticated } from "./authReducer"
import { User } from "./types"
import { connectSocket } from "../utils/socket"

export const checkAuth = createAsyncThunk<void, void>(
    'auth/checkAuth',
    async (_, { dispatch }) => {
        const [response, data] = await tokenRequest()
        console.log(data)
        if (response.ok) {
            const payload: User = {
                id: data.user.id,
                username: data.user.username,
            }

            dispatch(setAuthenticated(payload))
            connectSocket()

        } else {
            dispatch(setUnauthenticated())
        }
    }
)