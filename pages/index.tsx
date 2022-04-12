import {MainLayout} from "../src/components/Layouts/MainLayout";
import {MainPage} from "../src/components/pages/Main/MainPage";
import {useRouter} from "next/router";

export default function Home() {
    const router = useRouter()
    const {query} = router

    return <MainLayout title={"Главная"}>
        <MainPage verified = {query.verified as "true" | "false"} passwordActivated = {query['password-verified'] as "true" | "false"} token={query.active as string}/>
    </MainLayout>
}