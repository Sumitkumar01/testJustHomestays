"use client";
import Image from "next/image";
import { HeartIcon, PetPow, Star } from "../util/icons";
import React, { useState, useEffect, useContext, memo } from "react";
import axios from "axios";
// import Logreg from "./loginModal";
import Skeleton from "react-loading-skeleton";
import { MultiplierContext } from "../contexts/MultiplierContext";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Rating from "../pages/property/viewrating";
import { capitalCase } from "change-case";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Logreg from "../pages/loginModal";
import Link from "next/link";

const PropertyCard = ({ type, property, setShowLoginPopup }) => {
  const [prop, setProp] = useState([]);
  const [arr, setArr] = useState([]);
  const multiplier = useContext(MultiplierContext);
  const [cookies] = useCookies(["isLoggedIn", "mobile"]);
  const isLoggedIn = cookies.isLoggedIn;
  const [isWishlist, setWishlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState(null);
  const [rowId, setrowId] = useState(null);
  const router = useRouter();
  const [active, setActive] = useState(false);

  const setWish = () => {
    if (!isLoggedIn || !mobile) {
      // setShowModal(true);
      if (window.innerWidth > 720) {
        setShowModal(true);
        return;
      } else {
        setShowLoginPopup(true);
      }
    }
    submitWish();
  };

  useEffect(() => {
    setMobile(cookies.mobile);
    if (property) {
      getData();
    }
    if (mobile && isLoggedIn) {
      checkWish(mobile);
    }
    if (active) {
      submitWish();
    }
  }, [property, mobile, isLoggedIn, active, cookies.mobile]);

  const submitWish = async () => {
    let pid;
    if (router.pathname === "/wishlist") {
      pid = Number(property.PID);
    } else {
      pid = type === "JHS" ? Number(property.ncRecordId) : Number(property.Id);
    }

    let take_type;
    if (type !== "JHS") {
      take_type = "SV";
    } else {
      take_type = type;
    }
    if (isWishlist === false) {
      const options = {
        method: "POST",
        url: process.env.API_URL + "Wishlist",
        headers: { "xc-token": process.env.API_KEY },
        data: {
          Type: take_type,
          PID: `${pid}`,
          Mobile: Number(mobile),
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setWishlist(true);
        setrowId(response.data.Id);
      }
    } else {
      const options = {
        method: "DELETE",
        url: process.env.API_URL + "Wishlist/" + rowId,
        headers: { "xc-token": process.env.API_KEY },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setWishlist(false);
        setrowId(null);
      }
    }
  };

  const sendEvent = () => {
    window.gtag("event", "property_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a property",
      property_name: prop.Title,
    });
  };

  const checkWish = async (userid) => {
    let pid;
    if (router.pathname === "/wishlist" || router.pathname === "/") {
      pid = Number(property.PID);
    } else {
      pid = type === "JHS" ? property.ncRecordId : Number(property.Id);
    }

    const options = {
      method: "GET",
      url: process.env.API_URL + "Wishlist",
      params: {
        where:
          "(Mobile,eq," +
          userid +
          ")~and(Type,eq," +
          type +
          ")~and(PID,eq," +
          pid +
          ")",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.status === 200 && response.data.pageInfo.totalRows === 1) {
        console.log("api response: " + response.data);
        setWishlist(true);
        setrowId(response.data.list[0].Id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const pid =
        router.pathname === "/wishlist" || router.pathname === "/"
          ? property.PID
          : type === "JHS"
          ? property.ncRecordId
          : property.Id;

      const response = await axios.get("/api/getPropertyData", {
        params: {
          type,
          property: pid,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setProp(data);

        const source =
          type === "JHS" ? data.Images : JSON.parse(data.Images || "[]");
        const url =
          type === "JHS"
            ? "/api/process-image?imageUrl=https://test.justhomestay.in/"
            : "/api/process-image?imageUrl=";
        const imgs = source.map(
          (item) => url + (type === "JHS" ? item.path : item)
        );
        setArr(imgs);
      }
    } catch (error) {
      console.error("Failed to fetch property data:", error);
    }
  };

  console.log(type, property, mobile);

  return (
    <>
      <div className="flex flex-col gap-2 rounded-xl overflow-hidden border border-[#D6D6D6] shadow-xl">
        <div className="w-full relative">
          {arr.length ? (
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              navigation={true}
              className="property_card"
            >
              {arr.map((item, index) => (
                <SwiperSlide
                  className="relative w-full aspect-[4/3] pointer-events-auto"
                  key={index}
                >
                  <Image
                    src={item}
                    alt={`Slide ${index} | ${prop.Title} | JustHomeStay`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index === 0 ? "true" : "false"}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Skeleton height={255} />
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-white/20 z-10 pointer-events-none">
            <div className="absolute p-2 bg-white border border-[#393939]  rounded-md top-4 left-4">
              <p className="text-[#393939] text-base">Premium</p>
            </div>
            <button
              onClick={() => setWish()}
              className={`absolute   flex items-center justify-center p-2 rounded-full top-4 right-4 pointer-events-auto ${
                isWishlist ? "text-white" : "opacity-50 fill-neutral"
              }`}
            >
              <HeartIcon />
            </button>
            {prop["Pets Allowed"] && (
              <div className="absolute bottom-4 left-4">
                <PetPow />
              </div>
            )}
          </div>
        </div>
        <Link
          onClick={() => sendEvent()}
          href={`/property/${prop.Slug}`}
          className="flex flex-col gap-4 p-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base">
              {prop?.Town ? capitalCase(prop.Town) : <Skeleton />}
            </h2>
            <div className="text-base flex items-center gap-1">
              <Rating type={prop.Type} pid={prop.PID} card={true} />
            </div>
          </div>
          <p className="text-xl font-medium text-[#393939]">
            {prop && prop.Title ? (
              prop.Title.length > 30 ? (
                `${prop.Title.slice(0, 25)}...`
              ) : (
                prop.Title
              )
            ) : (
              <Skeleton />
            )}
          </p>
          <p className="flex items-center gap-2 text-base text-light">
            {/* <span className="">Upto 6 Guests</span> <span>•</span>
          <span className="">2 Bedrooms</span>
          <span>•</span>
          <span className="">3 Baths</span> */}
            {prop["Number of Bedrooms"] ? (
              <>
                {`Upto ${prop["Total Guests"]} Guests`}
                <span className="text-2xl">·</span>{" "}
                {`${prop["Number of Bedrooms"]} Bedrooms `}
                <span className="text-2xl">·</span>{" "}
                {`${prop["Number of Bathrooms"]} Baths `}
              </>
            ) : (
              <Skeleton width={200} height={20} />
            )}
          </p>
          <p className="text-light">Add dates to see prices</p>
          {/* <div className="w-full bg-black/30 h-[1px]" /> */}
          {/* <p className="text-xl font-medium ">
          <span className="sr-only">price per night</span>₹ 23,952{" "}
          <small className="text-[#4F4F4F] font-normal">per night</small>
        </p> */}
        </Link>
      </div>
      <Logreg
        from={setShowModal}
        open={showModal}
        active={setActive}
        mobile={setMobile}
      />
    </>
  );
};

export default PropertyCard;
