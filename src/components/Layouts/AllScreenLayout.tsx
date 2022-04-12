import Head from 'next/head'
import {Header} from "../Header/Header";
import React from "react";
import {Layout} from "./Layout";
import LoaderPage from "../LoaderPage";
import {Footer} from "../Footer/Footer";
import {HeaderAdmin} from "../Header/HeaderAdmin";

type Props = {
    title?: string
    isAuthRequired?: boolean
    isAdmin?: boolean
}
export const AllScreenLayout: React.FC<Props> = ({children, title = 'Main', isAuthRequired, isAdmin = false}) => {
    return (
        <>
            <Head>
                <title>{title} | GSL</title>
                <meta charSet="utf-8"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
            </Head>
            <main>
                <Layout isAuthRequired={!!isAuthRequired}>
                    <LoaderPage/>
                    {isAdmin ? <HeaderAdmin/> : <Header />}
                    <main className={`app__content ${isAdmin ? "admin" : ""}`}>
                        {children}
                    </main>
                    <Footer/>
                </Layout>
            </main>
        </>
    )
}