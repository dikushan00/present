import Document, {Head, Html, Main, NextScript} from 'next/document'
import React from "react";
function ym() {
    return (
        "<script type=\"text/javascript\" >\
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})\
   (window, document, \"script\", \"https://mc.yandex.ru/metrika/tag.js\", \"ym\");\
\
   ym(87996070, \"init\", {\
        clickmap:true,\
        trackLinks:true,\
        accurateTrackBounce:true\
   });\
</script>"
    );
}
export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="keywords"
                          content="футбол, спорт, играть, баскетбол, волейбол, лига любителей, лига любителей футбола, gsl, gsl-arena, global sport league, sport, play football, ллф, кокшетау"/>
                    <meta name="description"
                          content="Платформа, которая объединяет спортсменов профессионалов и любителей различных видов спорта."/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:image" content="og_img.png"/>
                    <meta property="og:title" content="GSL — платформа для любителей спорта"/>
                    <meta property="og:site_name" content="gsl-arena.kz"/>
                    <meta property="og:description"
                          content="Найди или создай команду, играй с лучшими командами города!"/>
                    <meta charSet="utf-8"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com"/>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;1,300;1,400&display=swap"
                        rel="stylesheet"/>
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
                          integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp"
                          crossOrigin="anonymous"/>
                </Head>
                <title>
                    Главная | GSL
                </title>
                <body className="light">
                <Main/>
                <NextScript/>
                <div dangerouslySetInnerHTML={{__html: ym()}}/>
                <div><img src="https://mc.yandex.ru/watch/87996070" style={{position: "absolute", left:"-9999px"}} alt="" /></div>
                </body>
            </Html>
        )
    }
}