import {MainLayout} from "../Layouts/MainLayout";
import classes from "./error.module.scss";
import Link from "next/link";


export const Page403 = () => {
    return <MainLayout>
        <div className="error-page__wrapper">
            <h1 className={classes.error}>Вход на эту страницу запрещен</h1>
            <p>Перейти на <Link href={'/'}><a className={classes.link}>главную</a></Link></p>
        </div>
    </MainLayout>
}