"use client";

import React, { useState, useEffect, useContext, memo } from "react";
import axios from "axios";
import { BiCard } from "react-icons/bi";
import { FaPaw } from "react-icons/fa";
import Logreg from "./loginModal";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { MultiplierContext } from "../contexts/MultiplierContext";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Rating from "./property/viewrating";
import { capitalCase } from "change-case";

const PHCard = memo(({ type, property, setShowLoginPopup }) => {
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
    if (router.pathname === "/wishlist") {
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
        router.pathname === "/wishlist"
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

  if (!prop && !arr) {
    return null;
  } else {
    return (
      <>
        <div className="z-10 lg:mx-2 relative rounded-xl drop-shadow-xl bg-base-100 text-neutral">
          <div className="relative overflow-hidden">
            {arr.length ? (
              <Carousel
                showThumbs={false}
                showStatus={false}
                swipeable
                dynamicHeight
                infiniteLoop
                showIndicators={false}
                swipeScrollTolerance={60}
                preventMovementUntilSwipeScrollTolerance
                showArrows={true}
              >
                {arr.map((src, index) => (
                  <Image
                    className="rounded-t-xl aspect-[4/3] object-cover"
                    src={src}
                    alt={`Slide ${index} | ${prop.Title} | JustHomeStay`}
                    width={400}
                    height={300}
                    key={index}
                    priority={index === 0 ? "true" : "false"}
                  />
                ))}
              </Carousel>
            ) : (
              <Skeleton height={255} />
            )}
            <div
              onClick={() => setWish()}
              className="absolute top-4 right-4 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="white"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-8 h-8 cursor-pointer ${
                  isWishlist ? "" : "opacity-50 fill-neutral"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </div>
            {prop["Pets Allowed"] && (
              <div className="absolute bottom-4 right-4">
                <FaPaw className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div className="p-2">
            <a
              onClick={() => sendEvent()}
              className="cursor-pointer"
              href={`/property/${prop.Slug}`}
            >
              <div className="flex gap-x-4 my-auto">
                <p className="text-sm my-auto">
                  {prop?.Town ? capitalCase(prop.Town) : <Skeleton />}
                </p>
                <Rating type={prop.Type} pid={prop.PID} card={true} />
              </div>
              <h3 className="text-xl font-bold pt-2">
                {prop && prop.Title ? (
                  prop.Title.length > 30 ? (
                    `${prop.Title.slice(0, 30)}...`
                  ) : (
                    prop.Title
                  )
                ) : (
                  <Skeleton />
                )}
              </h3>
              <p>
                {prop["Number of Bedrooms"] ? (
                  <>
                    {`${prop["Number of Bedrooms"]} bedrooms `}
                    <span className="text-2xl">·</span>{" "}
                    {`${prop["Number of Bathrooms"]} bathrooms `}
                    <span className="text-2xl">·</span>{" "}
                    {`${prop["Total Guests"]} guests`}
                  </>
                ) : (
                  <Skeleton width={200} height={20} />
                )}
              </p>
              <div className="grid grid-cols-3">
                <div className="grid col-span-2">
                  <p className="mt-4 text-sm font-light">
                    {prop["Cost per Night"] !== undefined ? (
                      <span className="text-xl font-bold">
                        {type === "JHS"
                          ? `₹ ${prop["Cost per Night"]}`
                          : `₹ ${
                              Number(JSON.parse(prop.Price)["villa_price"]) *
                              multiplier
                            }`}
                      </span>
                    ) : (
                      <Skeleton width={100} height={20} />
                    )}
                    {prop["Cost per Night"] !== undefined && "/ night"}
                  </p>
                </div>
                <div className="grid col-span-1">
                  {prop["Instant Booking"] && (
                    <span className="text-right mt-4 ml-auto">
                      <BiCard className="w-6 h-6 text-secondary" />
                    </span>
                  )}
                </div>
              </div>
            </a>
          </div>
        </div>
        <Logreg
          from={setShowModal}
          open={showModal}
          active={setActive}
          mobile={setMobile}
        />
      </>
    );
  }
});

export default PHCard;
