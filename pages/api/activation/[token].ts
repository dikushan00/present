import {NextApiRequest, NextApiResponse} from "next";
import {PlayerAPI} from "../../../src/api/PlayerAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query} = req;
    if (query?.token) {
        const response = await PlayerAPI.acceptActivation(query.token as string) as { status: boolean };
        if (response.status) {
            return res.redirect("/?verified=true")
        }
    }
    return res.redirect("/?verified=false")
}
