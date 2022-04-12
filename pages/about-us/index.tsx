import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {AboutUs} from "../../src/layouts/AboutUs/AboutUs";

const AboutUsPage = () => {
    return <MainLayout title={"О нас"}>
        <AboutUs />
    </MainLayout>
};

export default AboutUsPage;
