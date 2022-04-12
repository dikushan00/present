import React from "react";
import Head from 'next/head'
import {Header} from "../Header/Header";
import {Footer} from "../Footer/Footer";
import {Layout} from "./Layout";
import LoaderPage from "../LoaderPage";

type Props = {
    title?: string
    isAuthRequired?: boolean
}
export const MainLayout: React.FC<Props> = ({children, title = 'Главная', isAuthRequired}) => {
    return (
        <>
            <Head>
                <title>{title} | GSL</title>
            </Head>
            <Layout isAuthRequired={!!isAuthRequired}>
                <LoaderPage/>
                <Header/>
                <main className="app__content container">
                    {children}
                </main>
                <Footer/>
            </Layout>
        </>
    )
}