import React from 'react';
import classes from "./error.module.scss";
import Link from "next/link";

export const Page404 = () => {
    return<div className="error-page__wrapper">
        <h1 className={classes.error}>Страница не найдена</h1>
        <p>Перейти на <Link href={'/'}><a className={classes.link}>главную</a></Link></p>
    </div>
}
