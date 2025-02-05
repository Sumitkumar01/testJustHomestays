import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import ICard from "./influencerCard";

export default function Influencers() {
    const settings = {
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 3,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    };

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

    return (
      <div className="mt-8">
        <Slider {...settings}>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
          <div>
            <ICard image="https://imageio.forbes.com/specials-images/imageserve/5fd3b760a0e32d1889e1d1a3/0x0.jpg?format=jpg&width=1200" handle={"@he_bojo_chic"} iglink="#" property={"The Chanten on Greens"} proplink="#" />
          </div>
        </Slider>
      </div>
    );
}