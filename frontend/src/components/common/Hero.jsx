import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import BannerImg1 from '../../assets/images/banner-1.jpg';
import BannerImg2 from '../../assets/images/banner-2.jpg';

const Hero = () => {
    return (
        <section className='hero-section'>
            <Carousel>
                <Carousel.Item interval={2000}>
                    <img
                        className="d-block w-100"
                        src={BannerImg1}
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item interval={2000}>
                    <img
                        className="d-block w-100"
                        src={BannerImg2}
                        alt="Second slide"
                    />
                </Carousel.Item>
            </Carousel>
        </section>
    )
}

export default Hero