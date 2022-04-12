import React from 'react';
import {MaterialWrapper} from "../../components/styled/main/components";
import styled from "./AboutUs.module.sass"

export const AboutUs = () => {
    return <MaterialWrapper>
        <h1 className={styled.AboutUsTitle}>О нас</h1>

        <div>
            <p className={styled.AboutUsDescription}><span className={styled.AboutUsDescriptionTerm}>Global Sport League </span>
                – это платформа, которая предназначена для объединения спортсменов профессионалов и любителей различных видов спорта.</p>
            <p className={styled.AboutUsDescription}>Платформа позволяет пользователю <span className={styled.AboutUsMarked}>найти команду или создать новую</span>.
                Кроме того, платформа предоставляет функцию поиска команды, для товарищеского матча.
                Можно отправить заявку как и отдельной команде, так и всем командам определенной территории,
                и другие команды могут принять вашу заявку на товарищескую игру. </p>
            <p className={styled.AboutUsDescription}>Каждый игрок может <span className={styled.AboutUsMarked}>управлять</span> своей командой или своей страницей, следить за статистикой для улучшения своих навыков.</p>
        </div>
    </MaterialWrapper>
};
