import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {Page404} from "../../src/components/ErrorPage/Page404";

export default function ErrorPage() {
    return (
        <MainLayout>
            <Page404 />
        </MainLayout>
    )
}