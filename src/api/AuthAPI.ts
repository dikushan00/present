import {instance} from "./API"

export const AuthAPI = {

    login(username: string, password: string) {
        return instance.post("auth", {
            module: "client",
            username,
            password
        }).then(response => {
            return response
        })
    },

    checkAuthMe() {
        return instance.get<{token?: string, id: number}>("auth/me", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(response => {
            return response.data
        });
    },
    refreshToken(token) {
        return instance.post("auth/jwt/refresh/", {
            refresh: token
        }, {
            headers: {
                "Authorization": "Bearer " + (localStorage.getItem("access_token"))
            }
        }).then(res => res.data)
    },
    async passwordActivation(token: string) {
        return await instance.get(`auth/password-activation/${token}`).then(res => res.data)
    },
}