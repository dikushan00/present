import React from 'react';
import {Button, Carousel} from "antd";
import Link from "next/link";
import {ImgWrapper} from "../ImgWrapper";
import {SliderItemType} from "../../../types/app";

const MainSlider = () => {
    const [sliderItems,] = React.useState<SliderItemType[] | null>([
        {
            href: "/about-us",
            title: "Добро пожаловать!",
            description: "GSL приветствует вас",
            bg_img: null
        },
        {
            href: "/Teams",
            title: "Лучшие команды в твоем городе",
            description: "",
            bg_img: null
        },
        {
            href: "/players",
            title: "Лучшие игроки в твоего города",
            description: "",
            bg_img: null
        }
    ])

    return <div className="row">
        <div className="col-md-12 slider__main__wrapper">
            <Carousel autoplay autoplaySpeed={6000} dots>
                {
                    sliderItems?.map((item, i) => {
                        return <Link href={item.href || "/"} key={i}>
                            <a>
                                <div className="slider__main">
                                    <ImgWrapper defaultSrc={"/img/pres_bg.jpg"} className="slider__bg" src={item.bg_img}
                                                alt="bg"/>
                                    <div className="slider__main__content">
                                        <h1 className="title">{item.title}</h1>
                                        {!!item.description && <p className={"slider__main__description"}>{item.description}</p>}
                                        <Button>Подробнее</Button>
                                    </div>
                                </div>
                            </a>
                        </Link>

                    })
                }
            </Carousel>
        </div>
    </div>
};

export default MainSlider;
