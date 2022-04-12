import {NextApiRequest, NextApiResponse} from "next";
import {AuthAPI} from "../../../src/api/AuthAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query} = req;
    if (query?.token) {
        let token = query.token as string
        const response = await AuthAPI.passwordActivation(token) as { status: boolean };
        if (response.status) {
            return res.redirect(`/?password-verified=true&active=${token}`)
        }
    }
    return res.redirect("/?password-verified=false")
}