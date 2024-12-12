export const testRequest = async () => {
    const response = await fetch(
        `http://localhost:5000/api/auth/hello`
    )

    const data = await response.json()
    return [response, data]
}

export const loginRequest = async (username: string, password: string) => {
    const body = JSON.stringify({
        username: username,
        password: password
    })
    
    const response = await fetch(
        `http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        }
    )

    const data = await response.json()
    return [response, data]
}

export const registerRequest = async (username: string, password: string) => {
    const body = JSON.stringify({
        username: username,
        password: password
    })
    
    const response = await fetch(
        `http://localhost:5000/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        }
    )

    const data = await response.json()
    return [response, data]
}