"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Rating from "react-rating";
import { StarIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import TestimonialsCard from "../newComponents/TestimonialsCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import { SectionWithContainer } from "../newComponents/SectionComponents";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "#0C5110" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "#0C5110" }}
      onClick={onClick}
    />
  );
}

export default function Testimonials() {
  const [review, setReview] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setSettings({
      infinite: true,
      slidesToShow: isMobile ? 1 : 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      dots: isMobile,
      arrows: !isMobile,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    });
  }, []);

  // Fetch data from the API
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        process.env.API_URL + "Website%20Review",
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      setReview(response.data.list);
    };
    getData();
  }, []);

  return (
    <SectionWithContainer>
      <div className="hidden">
        <Slider {...settings}>
          {review.map((rev, index) => (
            <div key={index}>
              <div className="m-2 p-2 bg-base-100 text-neutral rounded-xl drop-shadow-lg">
                <q>
                  <i>{rev.Review}</i>
                </q>
                <div className="grid grid-cols-4 gap-x-2 mt-8 w-[95%]">
                  {rev.Image && (
                    <div className="grid col-span-1">
                      <Image
                        src={
                          "https://test.justhomestay.in/" + rev.Image[0].path
                        }
                        className="w-full aspect-square object-cover rounded-lg"
                        width={400}
                        height={400}
                        alt="Testimonial | JHS"
                      />
                    </div>
                  )}
                  <div className="grid col-span-3">
                    <div className="rating">
                      <Rating
                        start={0}
                        step={1}
                        stop={rev.Rating}
                        emptySymbol={<StarIcon className="w-6" />}
                        fullSymbol={<StarIcon className="w-6" />}
                        readonly
                      />
                    </div>
                    <p className="font-bold">{rev.Name}</p>
                    <p className="text-sm">{rev.Profession}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="block">
        <Swiper
          slidesPerView={1.2}
          spaceBetween={16}
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          // loop={true}
          speed={900}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
        >
          {review?.map((item, i) => (
            <SwiperSlide key={i}>
              <TestimonialsCard
                src={"https://test.justhomestay.in/" + item.Image[0].path}
                name={item.Name}
                alt={item.Name || "Justhome stay"}
                profession={item.Profession}
                review={item.Review}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </SectionWithContainer>
  );
}
