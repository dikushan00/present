import React from "react";
import {instance} from "../../api/API";
import {useSelector} from "react-redux";
import {getToken} from "../../redux/auth-selector";

type MethodsNamesType = "get" | "post" | "put" | "patch" | "delete"
export const useHttp = () => {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const token = useSelector(getToken)

    const request = React.useCallback(async <T extends any>(url: string, method: MethodsNamesType = "get",
                                                            body: {} = {},
                                                            headers: {} | null = {}, isTokenRequired: boolean = true) => {
        if (!token && isTokenRequired) {
            setError("Please refresh the page!")
            return
        }
        let defaultHeaders = {
            "Authorization": "Bearer " + (token || localStorage.getItem("access_token"))
        }
        setLoading(true)
        try {
            //@ts-ignore
            const response = await instance[method](url, body, {headers :{...defaultHeaders, ...headers}})
            const data: T = await response.data
            if (!response.data || response?.data?.status === false) {
                new Error(response?.data?.message || "Что-то пошло не так")
            }
            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            setError(e?.response?.data?.message || e.message)
        }
    }, [token])

    const clearError = () => setError(null)

    return {loading, request, error, clearError}
}