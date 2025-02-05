"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Header from "./header2";
import Footer from "../Footer.jsx";
import Breadcrumb from "../breadcrumb";
import SThis from "../sharethis";
import COModal from "../checkoutModal";
import { ShareIcon, HeartIcon } from "@heroicons/react/24/outline";
import { BsTelephone, BsXCircle, BsXLg } from "react-icons/bs";
import Gallery from "./gallery";
import BCard from "./bedroomcard";
import ACard from "./amenitygrid";
import moment from "moment";
import DatePicker from "react-datepicker";
import Stepper from "../numStepper";
import Neighborhood from "./neighborhood";
import LD from "./longDesc";
import APAmenities from "./allAmenities";
import HRules from "./houseRules";
import IInfo from "./impInfo";
import { useRouter } from "next/router";
import { differenceInDays } from "date-fns";
import Availability from "./availability";
import axios from "axios";
import SubmitManager from "./stayManager";
import { MultiplierContext } from "../../contexts/MultiplierContext";
import { useCookies } from "react-cookie";
import Logreg from "../loginModal";
import SReview from "./submitReview";
import VReview from "./viewReviews";
import Head from "next/head";
import Rating from "./viewrating";
import { AiFillHeart } from "react-icons/ai";
import { capitalCase } from "change-case";
import {
  BackIcon,
  BackIcon2,
  CallIcon,
  CloseButton,
  FoodTypeIcon,
  HeartIconFill,
  OutlineCallIcon,
  SmallBackBtn,
} from "../../util/icons";
import Link from "next/link";
import Image from "next/image";
import Accordion from "../../newComponents/Accordion";

async function fetchData(slug) {
  try {
    let response = await fetch(
      `${process.env.API_URL}Property?where=(Slug,eq,${slug})`,
      {
        headers: {
          "xc-token": process.env.API_KEY,
        },
      }
    );
    let data = await response.json();

    if (data.list.length === 0) {
      response = await fetch(
        `${process.env.API_URL}StayVista?where=(Slug,eq,${slug})`,
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      data = await response.json();
    }

    return data.list.length > 0 ? data.list[0] : null;
  } catch (error) {
    console.error("Fetching data failed", error);
    return null;
  }
}

export async function getServerSideProps({ params }) {
  const blogs = await fetchData(params.propid);
  if (!blogs) {
    return { notFound: true };
  }
  return { props: { blogs } };
}

export default function Property({ blogs }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const object = [1];
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [show, setShow] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [url, setUrl] = useState("");
  const [openLd, setOpenld] = useState(false);
  const [openAd, setOpenAd] = useState(false);
  const [openHr, setopenHr] = useState(false);
  const [openInfo, setopenInfo] = useState(false);
  const router = useRouter();
  const [available, setAvailable] = useState();
  const [check, setCheck] = useState(0);
  const [a, setA] = useState();
  const [b, setB] = useState();
  const [c, setC] = useState();
  var final = 0;
  var extraA = 0;
  var extraC = 0;
  var extraCost = 0;
  var night = 0;
  var tg = 0;
  const [showContact, setsContact] = useState(false);
  const multiplier = useContext(MultiplierContext);
  const [bookedDates, setBookedDates] = useState([]);

  const [cookies, setCookie, getCookie] = useCookies(["isLoggedIn", "mobile"]);
  const [user, setUser] = useState(null);
  const isLoggedIn = cookies.isLoggedIn;
  const [login, setLogin] = useState(false);
  const [ropen, setRopen] = useState(false);
  const [option, setOption] = useState("");
  const [isWishlist, setWishlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rowId, setrowId] = useState(null);
  const [mobile, setMobile] = useState(cookies.mobile || null);

  const setWish = () => {
    if (!isLoggedIn || !mobile) {
      setShowModal(true);
      return;
    }
    submitWish();
  };

  const sendEvent = (title, value) => {
    window.gtag("event", "booking_started", {
      event_category: "Conversion",
      event_label: "User clicked on a location",
      prop_name: title,
      prop_value: value,
    });
  };

  const submitWish = async () => {
    if (isWishlist === false) {
      const options = {
        method: "POST",
        url: process.env.API_URL + "Wishlist",
        headers: { "xc-token": process.env.API_KEY },
        data: {
          Type: blogs.Type,
          PID: Number(blogs.PID),
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

  const checkWish = async (userid) => {
    const pid = Number(blogs.PID);
    const type = blogs.Type;
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
      } else {
        setWishlist(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn || mobile) {
      setMobile(mobile);
      checkWish(mobile);
    }
  }, [isWishlist, showModal, mobile]);

  const handleReview = () => {
    if (!cookies.mobile) {
      setOption("review");
      setLogin(true);
      return;
    }
    if (cookies.mobile && cookies.isLoggedIn) {
      setRopen(true);
    }
  };

  useEffect(() => {
    const qPam = new URLSearchParams(window.location.search);
    if (qPam.get("startDate") != null) {
      setStartDate(new Date(qPam.get("startDate")));
    }
    if (qPam.get("endDate") != null) {
      setendDate(new Date(qPam.get("endDate")));
    }
    setAdult(Number(qPam.get("adult")));
    setChildren(Number(qPam.get("child")));
  }, []);

  useEffect(() => {
    async function fetchBookedDates() {
      try {
        const response = await fetch("/api/bookedDates?id=" + blogs.ncRecordId);
        if (response.status === 200) {
          const data = await response.json();
          setBookedDates(data.bookedDates.map((date) => new Date(date)));
        }
      } catch (error) {
        console.error("Failed to fetch booked dates", error);
      }
    }
    if (blogs.Type === "JHS") {
      fetchBookedDates();
    }
  }, [blogs]);

  if (endDate) {
    night = differenceInDays(new Date(endDate), new Date(startDate));
  }

  if (adult > 0) {
    tg = Number(adult) + Number(children);
    if (tg > blogs["Guests Included"]) {
      if (adult > blogs["Guests Included"] && !children) {
        extraA = tg - blogs["Guests Included"];
        extraC = 0;
      } else if (adult > blogs["Guests Included"] && children > 0) {
        extraA = adult - blogs["Guests Included"];
        extraC = tg - adult;
      } else {
        extraA = 0;
        extraC = tg - blogs["Guests Included"];
      }
    } else {
      extraCost = 0;
    }
  } else {
    extraCost = 0;
  }

  if (extraA > 0 && extraC > 0) {
    extraCost =
      extraA * Number(blogs["Extra Cost per Adult"]) +
      extraC * Number(blogs["Extra Cost per Child"]);
  } else if (extraA > 0 && extraC == 0) {
    extraCost = extraA * Number(blogs["Extra Cost per Adult"]);
  } else if (extraA == 0 && extraC > 0) {
    extraCost = extraC * Number(blogs["Extra Cost per Child"]);
  } else {
    extraCost = 0;
  }

  if (night > 0) {
    if (extraCost == 0) {
      final = Number(blogs["Cost per Night"]) * night;
    } else {
      final = (Number(blogs["Cost per Night"]) + Number(extraCost)) * night;
    }
  } else {
    final = 0;
  }

  for (let i = 1; i < blogs["Number of Bedrooms"]; i++) {
    object.push(i + 1);
  }

  const dateChange = (dates) => {
    setAvailable(null);
    setCheck(0);
    setA();
    setB();
    setC();
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  };

  function time(input) {
    return moment(input, "HHmm").format("h:mm A");
  }

  useEffect(() => {
    if (cookies.mobile) {
      setUser(cookies.mobile);
    }
  }, [cookies.mobile]);

  useEffect(() => {
    if (cookies.mobile) {
      setUser(cookies.mobile);
    }
  }, []);

  const expandLd = () => {
    setOpenld(!openLd);
  };

  const structure = {
    "@context": "http://schema.org",
    "@type": "Hotel",
    name: blogs.Title,
    url: `https://justhomestay.in${router.pathname}`,
    logo: `https://justhomestay.in/logo_main.webp`,
    image:
      blogs.Type === "JHS"
        ? `https://test.justhomestay.in/${blogs.Images[0].path}`
        : JSON.parse(blogs.Images)[0],
    description: `${blogs.Title} by Just Home Stay`,
    telephone: "+919810325245",
    email: "priyanshu@justhomestay.in",
    hasMap: `https://www.google.com/maps/place//@${blogs.Latiude},${blogs.Longitude},16z?entry=ttu`,
    checkinTime: "14:00",
    checkoutTime: "11:00",
    priceRange: blogs["Cost per Night"],
  };

  const [scroll, setScroll] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  if (blogs.PID) {
    return (
      <div className="flex justify-center">
        <Head>
          <title>{`${blogs.Title} | ${capitalCase(blogs.Town)} | ${capitalCase(
            blogs.State
          )} | Just Home Stay`}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content={`${blogs.Title} by Just Home Stay is a ${blogs["Number of Bedrooms"]} bedroom luxury stay located at ${blogs.Town}, ${blogs.State}`}
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`${blogs.Title} | ${capitalCase(
              blogs.State
            )} | Just Home Stay`}
          />
          <meta
            property="og:description"
            content={`${blogs.Title} by Just Home Stay is a ${blogs["Number of Bedrooms"]} bedroom luxury stay located at ${blogs.Town}, ${blogs.State}`}
          />
          <meta
            property="og:url"
            content={`https://justhomestay.in/property/${blogs.Slug}`}
          />
          <meta
            property="og:image"
            content={
              blogs.Type === "JHS"
                ? `https://test.justhomestay.in/${blogs.Images[0].path}`
                : JSON.parse(blogs.Images)[0]
            }
          />
          <link
            rel="canonical"
            href={`https://justhomestay.in/property/${blogs.Slug}`}
          />
          <script
            key="structure"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON?.stringify(structure) }}
          />
          <meta charSet="UTF-8" />
        </Head>

        <div className="lg:w-[1140px] w-full md:px-0 lg:px-4">
          <div className="lg:block hidden">
            <Header />
          </div>

         

          <div className="md:grid md:grid-cols-3 block lg:mt-2 lg:px-0">
            <div className="lg:grid hidden col-span-2 ">
              {blogs.Town ? (
                <Breadcrumb
                  location={blogs.Town}
                  state={blogs.State}
                  property={blogs.Title}
                  pid={blogs.PID}
                />
              ) : (
                <></>
              )}
            </div>
            {/* lg screen or tablet */}
            <div className="md:grid hidden col-span-1 justify-end">
              <div className="grid grid-cols-2 gap-x-4">
                <ShareIcon
                  className="w-6 cursor-pointer"
                  onClick={() => {
                    setShow(true);
                  }}
                />
                <div className="cursor-pointer" onClick={() => setWish()}>
                  {isWishlist ? (
                    <AiFillHeart className="w-8 h-8" />
                  ) : (
                    <AiFillHeart className="w-8 h-8 opacity-50 text-neutral" />
                  )}
                </div>
              </div>
            </div>
          </div>
          {blogs.Images ? (
            <Gallery
              slug={blogs.Slug}
              images={blogs.Images}
              type={blogs.Type}
              setWish={setWish}
              isWishlist={isWishlist}
            />
          ) : null}
          <div
            className={`max-md:fixed ${
              scroll ? "top-16" : "top-[69%]"
            } transition-transform duration-300 ease-in-out bg-white max-md:px-4 max-md:pt-4 max-sm:rounded-t-3xl max-sm:border-t border-light z-30`}
            onTouchStart={(e) => {
              setTouchStartY(e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              const touchEndY = e.touches[0].clientY;
              const deltaY = touchStartY - touchEndY;

              // Only trigger if the swipe gesture is significant (e.g., > 50px)
              if (Math.abs(deltaY) > 100) {
                if (deltaY > 0) {
                  setScroll(true); // Swipe up
                } else {
                  setScroll(false); // Swipe down
                }
              }
            }}
          >
            <div className="w-full lg:hidden">
              <button
                className="w-full flex justify-center py-2"
                onClick={() => setScroll(!scroll)}
              >
                <CloseButton />
              </button>
            </div>
            <div
              className={` ${
                scroll
                  ? "max-md:overflow-scroll max-md:h-[90vh] max-md:pb-40 lg:mt-6"
                  : ""
              } `}
            >
              <div className={`md:grid md:grid-cols-7 block gap-6 `}>
                <div className="lg:hidden my-3">
                  {blogs.Town ? (
                    <p className="flex  gap-2 text-normal text-sm w-full items-center">
                      <Link href="/">Home</Link>
                      <span className="">
                        <SmallBackBtn />
                      </span>
                      <Link href="/property">
                        Property in {blogs.State.slice(0, 10)}...
                      </Link>
                      <span className="">
                        <SmallBackBtn />
                      </span>
                      <span className="text-light">
                        {blogs.Title.slice(0, 10)}...
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="grid col-span-4 space-y-2">
                  <div>
                    <h1 className="text-3xl font-semibold">{blogs.Title}</h1>
                    <div className="flex gap-x-4">
                      {blogs.Town ? (
                        <p className="text-base text-slate-700 mt-2">
                          {capitalCase(blogs.Town) +
                            ", " +
                            capitalCase(blogs.State)}
                        </p>
                      ) : (
                        <></>
                      )}
                      <Rating type={blogs.Type} pid={blogs.PID} />
                    </div>
                    {/* <div className="seperator mt-4" /> */}
                    <p className="mt-2">
                      Upto {blogs["Total Guests"]} guests
                      <span className="text-xl font-bold"> · </span>
                      {blogs["Number of Bedrooms"]} bedrooms
                      <span className="text-xl font-bold"> · </span>
                      {blogs["Number of Bathrooms"]} Bathrooms
                      {/* <span className="text-xl font-bold"> · </span> */}
                      {/* {blogs["Total Guests"]} guests */}
                    </p>
                    <div className="lg:hidden h-[1px] w-full bg-light mt-6"></div>
                    {/* {openLd ? (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `${
                          blogs["Long Description"]
                            ? blogs["Long Description"]
                            : ""
                        },`,
                      }}
                      className="mt-4 mb-6"
                    />
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          blogs["Long Description"]?.slice(0, 250) + "...",
                      }}
                      className="mt-4 mb-6"
                    />
                  )}
                  <a
                    onClick={() => expandLd()}
                    className="font-bold text-primary underline cursor-pointer"
                  >
                    <span>{openLd ? "Show Less" : "Show More"} &gt;</span>
                  </a> */}
                    {/* <div className="divider2" /> */}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-4">Rooms & Beds</h2>
                    {(blogs.Bedrooms && blogs.Bedrooms.length) ||
                    (blogs["Bedrooms List"] &&
                      blogs["Bedrooms List"].length) ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4 mt-4">
                        {blogs?.Bedrooms?.map((bedroom, index) => (
                          <div key={index} className="grid col-span-1">
                            <BCard id={bedroom} index={index} />
                          </div>
                        ))}
                        {blogs["Bedrooms List"]?.map((bedroom, index) => (
                          <div key={index} className="grid col-span-1">
                            <BCard id={bedroom} index={index} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {object.map((index) => (
                          <div
                            className="grid col-span-1 outline outline-secondary outline-[2px] rounded-xl p-2"
                            key={index}
                          >
                            <p className="font-bold">Bedroom {index}</p>
                            <p>1 Double Bed</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="divider2" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-4">
                      What this place offers?
                    </h2>
                    {blogs.Amenity ? (
                      <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-4 mb-6">
                        {blogs["Amenity"]?.slice(0, 9).map((amen, index) => {
                          return (
                            <div key={index} className="grid col-span-1">
                              <ACard id={amen.ncRecordId} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                    <a
                      onClick={() => setOpenAd(true)}
                      className="font-bold text-primary underline cursor-pointer lg:block hidden"
                    >
                      <span>
                        Show all {blogs.Amenity ? blogs.Amenity.length : null}{" "}
                        Amenities &gt;
                      </span>
                    </a>
                    <a
                      onClick={() => setOpenAd(true)}
                      className="font-semibold text-dark border border-dark py-4 px-4 w-full lg:hidden flex items-center justify-center rounded-lg cursor-pointer"
                    >
                      <span>View all Amenities</span>
                    </a>
                    <APAmenities
                      open={openAd}
                      from={setOpenAd}
                      amen={blogs.Amenity}
                    />
                  </div>
                  <div className="w-full h-[1px] bg-light" />
                  {/* <div className="lg:hidden h-[1px] w-full bg-light mt-6"></div> */}
                  {openLd ? (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `${
                          blogs["Long Description"]
                            ? blogs["Long Description"]
                            : ""
                        },`,
                      }}
                      className="mt-4 mb-6"
                    />
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          blogs["Long Description"]?.slice(0, 250) + "...",
                      }}
                      className="mt-4 mb-6"
                    />
                  )}
                  <a
                    onClick={() => expandLd()}
                    className="font-bold text-primary underline cursor-pointer"
                  >
                    <span>{openLd ? "Show Less" : "Show More"} &gt;</span>
                  </a>
                  <div className="divider2" />
                  <div>
                    <h2 className="text-2xl font-bold mt-4">Meals</h2>
                    <p className="mt-4 mb-6">
                      Indulge in an all-day meal package of freshly prepared
                      North Indian vegetarian and non-vegetarian local
                      specialities.
                    </p>
                    <div className="relative w-full aspect-[4/3] lg:aspect-[4/2] rounded-lg overflow-hidden">
                      <Image
                        src="/food.webp"
                        alt="food"
                        className="object-cover object-center"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="my-4">
                      {/* <img
                      src="https://openclipart.org/image/2000px/127159"
                      className="w-28"
                    /> */}
                      {blogs["menuLink"] ? (
                        <a
                          className="font-bold text-normal w-fit shadow-inner cursor-pointer px-4 py-4 border border-light bg-[#F5F5F5] rounded-lg flex items-center justify-center gap-2"
                          target="_blank"
                          href={blogs.menuLink}
                        >
                          <span className="">
                            <FoodTypeIcon />
                          </span>
                          <span>View Menu</span>
                        </a>
                      ) : null}
                    </div>
                    <p className="text-sm mb-6">
                      Note:
                      <br />
                      Prepared with local touch and freshly sourced ingredients,
                      our home-style dining experience is highly recommended.
                      Prices may vary subject to availability and peak season
                      rates.
                    </p>

                    <div className="divider2" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-4">House rules</h2>
                    <div className="flex gap-2 my-4">
                      <p className="">
                        Check-in:{" "}
                        {blogs["Checkin Time"]
                          ? time(blogs["Checkin Time"])
                          : "2:00 PM"}
                      </p>
                      <span className="text-light">•</span>
                      <p className="">
                        Check-out:{" "}
                        {blogs["Checkout Time"]
                          ? time(blogs["Checkout Time"])
                          : "11:00 AM"}
                      </p>
                    </div>
                    {/* <a
                    onClick={() => setopenHr(true)}
                    className="font-bold text-primary underline cursor-pointer"
                  >
                    <span>View all house rules &gt;</span>
                  </a> */}
                    <HRules
                      open={openHr}
                      from={setopenHr}
                      guests={blogs["Total Guests"]}
                      pets={blogs["Pets Allowed"]}
                      petcost={blogs["Pet Fee per Night"]}
                      rules={blogs["Additional Rules"]}
                    />
                    <hr className="w-full bg-light" />
                  </div>
                  <Accordion
                    title={`<h2 class="lg:text-2xl text-xl font-bold mt-4 mb-2">
                      Cancellation policy
                    </h2>`}
                    content={
                      <>
                        <p>
                          <b>More than 14 days before Check in date</b>
                        </p>
                        <p>
                          We will refund 80% of the entire amount to the
                          original payment method or you can avail Wallet
                          balance equal to 100% of the entire amount
                        </p>
                        <p className="mt-4">
                          <b>7-14 days before Check in date</b>
                        </p>
                        <p>
                          We will refund 50% of the entire amount to the
                          original payment method or you can avail Wallet
                          balance equal to 60% of the entire amount
                        </p>
                        <p className="mt-4">
                          <b>Up to 7 days before Check in date</b>
                        </p>
                        <p className="mb-4">No refund will be issued</p>
                        <a
                          href="/cancellation-policy"
                          target="_blank"
                          className="mt-4"
                        >
                          <p>
                            <span className="underline underline-offset-2">
                              Click Here
                            </span>{" "}
                            for Complete Cancellation Policy
                          </p>
                        </a>
                      </>
                    }
                  />
                  <hr className="w-full bg-light" />

                  {/* <div>
                  <h2 className="text-2xl font-bold mt-4 mb-2">
                    Cancellation policy
                  </h2>

                  <p>
                    <b>More than 14 days before Check in date</b>
                  </p>
                  <p>
                    We will refund 80% of the entire amount to the original
                    payment method or you can avail Wallet balance equal to 100%
                    of the entire amount
                  </p>
                  <p className="mt-4">
                    <b>7-14 days before Check in date</b>
                  </p>
                  <p>
                    We will refund 50% of the entire amount to the original
                    payment method or you can avail Wallet balance equal to 60%
                    of the entire amount
                  </p>
                  <p className="mt-4">
                    <b>Up to 7 days before Check in date</b>
                  </p>
                  <p className="mb-4">No refund will be issued</p>
                  <a
                    href="/cancellation-policy"
                    target="_blank"
                    className="mt-4"
                  >
                    <p>Click Here for Complete Cancellation Policy</p>
                  </a>
                  <div className="divider2" />
                </div> */}

                  <Accordion
                    title={`<h2 class="lg:text-2xl text-xl font-bold mt-4 mb-2">
                      Other important information
                    </h2>`}
                    content={
                      <>
                        {blogs["WiFi Type"] && blogs["WiFi Speed (mbps)"] ? (
                          <p className="mt-2">
                            Wifi: {blogs["WiFi Type"]} - upto{" "}
                            {blogs["WiFi Speed (mbps)"]} mbps
                          </p>
                        ) : (
                          <p className="mt-2">
                            Wifi: Information Not Available
                          </p>
                        )}
                        <p>
                          Week-long Stay Discount:{" "}
                          {blogs["Long Stay Weekly Discount"] * 100}%/night
                        </p>
                        <p className="mb-6">
                          Month-long Stay Discount:{" "}
                          {blogs["Long Stay Monthly Discount"] * 100}%/night
                        </p>
                        <a
                          onClick={() => setopenInfo(true)}
                          className="font-bold text-primary underline cursor-pointer"
                        >
                          <span>View all &gt;</span>
                        </a>
                        <IInfo
                          open={openInfo}
                          from={setopenInfo}
                          adult={blogs["Extra Cost per Adult"]}
                          child={blogs["Extra Cost per Child"]}
                          minbook={blogs["Minimum Booking Period"]}
                          maxbook={blogs["Maximum Booking Period"]}
                        />
                      </>
                    }
                  />
                  {/* <div>
                  <h2 className="text-2xl font-bold mt-4">
                    Other important information
                  </h2>
                  {blogs["WiFi Type"] && blogs["WiFi Speed (mbps)"] ? (
                    <p className="mt-2">
                      Wifi: {blogs["WiFi Type"]} - upto{" "}
                      {blogs["WiFi Speed (mbps)"]} mbps
                    </p>
                  ) : (
                    <p className="mt-2">Wifi: Information Not Available</p>
                  )}
                  <p>
                    Week-long Stay Discount:{" "}
                    {blogs["Long Stay Weekly Discount"] * 100}%/night
                  </p>
                  <p className="mb-6">
                    Month-long Stay Discount:{" "}
                    {blogs["Long Stay Monthly Discount"] * 100}%/night
                  </p>
                  <a
                    onClick={() => setopenInfo(true)}
                    className="font-bold text-primary underline cursor-pointer"
                  >
                    <span>View all &gt;</span>
                  </a>
                  <IInfo
                    open={openInfo}
                    from={setopenInfo}
                    adult={blogs["Extra Cost per Adult"]}
                    child={blogs["Extra Cost per Child"]}
                    minbook={blogs["Minimum Booking Period"]}
                    maxbook={blogs["Maximum Booking Period"]}
                  />
                </div> */}
                </div>

                {!showCheckModal && (
                  <div className="fixed z-20 p-4 bg-white h-max w-full  bottom-0 left-0 md:hidden drop-shadow-[0_-5px_10px_rgba(0,0,0,0.25)]">
                    <div className="mx-auto">
                      <div className="grid grid-cols-6 gap-2">
                        <div className="grid col-span-4">
                          <p className="text-base">Add dates to see prices</p>
                          {/* <p className="text-2xl font-bold">
                        {blogs.Type === "JHS"
                          ? "₹ " + blogs["Cost per Night"]
                          : "₹ " + blogs["Cost per Night"] * multiplier}
                        <span className="text-sm font-normal">/night</span>
                      </p> */}
                        </div>
                        <div className="grid col-span-2 text-right">
                          <div className="flex justify-end gap-4 my-auto">
                            <ShareIcon
                              className="w-6 cursor-pointer"
                              onClick={() => {
                                setShow(true);
                              }}
                            />
                            <div
                              className="cursor-pointer"
                              onClick={() => setWish()}
                            >
                              {isWishlist ? (
                                <AiFillHeart className="w-6 h-6 cursor-pointer" />
                              ) : (
                                <AiFillHeart className="w-6 h-6 cursor-pointer opacity-50 text-neutral" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 col-span-6 mt-3">
                          <div className="text-sm font-bold bg-white border border-primary text-neutral rounded-lg py-3 w-full ml-auto col-span-1">
                            <a
                              href="tel:+919810325245"
                              className="flex my-auto gap-x-2 justify-center items-center"
                            >
                              {/* <BsTelephone className="w-5 h-5 " /> */}
                              <p>Call Us Now</p>
                            </a>
                          </div>
                          {/* <div className="text-sm font-bold bg-secondary text-neutral rounded-lg py-3 w-full ml-auto col-span-1">
                        <a
                          href="tel:+919810325245"
                          className="flex my-auto gap-x-2 justify-center items-center"
                        >
                          <BsTelephone className="w-5 h-5 " />
                          <p>Call Now</p>
                        </a>
                      </div> */}
                          <button
                            className="text-sm font-bold bg-primary text-white rounded-lg py-3 w-full ml-auto col-span-1"
                            onClick={(e) => setShowCheckModal(true)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="md:grid md:col-span-3 mt-4 md:mt-0 hidden">
                  {blogs["Instant Booking"] ? (
                    <div className="bg-base-100 h-max rounded-xl shadow-xl md:p-6 p-4 sticky top-4">
                      <p className="text-2xl font-bold">
                        {blogs.Type === "JHS"
                          ? "₹ " + blogs["Cost per Night"]
                          : "₹ " + blogs["Cost per Night"] * multiplier}
                        <span className="text-sm font-normal">/night</span>
                      </p>
                      <p className="mt-4 font-bold">
                        Select check-in & check-out dates
                      </p>
                      <DatePicker
                        onChange={dateChange}
                        startDate={startDate}
                        endDate={endDate}
                        selected={startDate}
                        selectsRange
                        isClearable={true}
                        placeholderText="Select check-in & check-out dates"
                        className="input w-full mt-4 input-bordered"
                        minDate={new Date()}
                        excludeDates={bookedDates}
                        monthsShown={2}
                        allowSameDay={false}
                      />
                      {endDate && blogs.Type == "JHS" ? (
                        <Availability
                          eDate={endDate}
                          sDate={startDate}
                          ptype={blogs.Type}
                          pid={blogs["PID"]}
                          avail={setAvailable}
                        />
                      ) : null}
                      {!endDate && blogs.Type == "JHS" ? (
                        <p className="mt-4 text-warning">
                          Select dates to continue
                        </p>
                      ) : null}
                      {available == 0 && blogs.Type == "JHS" ? (
                        <p className="mt-4">Dates are Booked</p>
                      ) : null}
                      {available == 1 && blogs.Type == "JHS" ? (
                        <>
                          <p className="mt-6 font-bold">Select guests</p>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="grid col-span-2">
                              <p className="text-lg font-bold">Adults</p>
                              <p>Age 12 years & above</p>
                            </div>
                            <div className="grid col-span-1">
                              <Stepper
                                value={adult}
                                name="adult"
                                reverse={setAdult}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="grid col-span-2">
                              <p className="text-lg font-bold">Children</p>
                              <p>Between ages 5-12 years</p>
                            </div>
                            <div className="grid col-span-1">
                              <Stepper
                                value={children}
                                name="child"
                                reverse={setChildren}
                              />
                            </div>
                          </div>
                          {tg > 0 && tg <= blogs["Total Guests"] ? (
                            <div className="mt-4">
                              <p className="text-center text-lg font-bold">
                                Cost
                              </p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="grid col-span-2 gap-y-2">
                                  <p>Cost per Night</p>
                                  <p>No. of Nights</p>
                                  <p>Total Cost</p>
                                  <p className="text-sm">(Taxes additional)</p>
                                </div>
                                <div className="grid col-span-1 gap-y-2 text-right">
                                  <p>{final / night}</p>
                                  <p>{night}</p>
                                  <p>{final}</p>
                                  <p></p>
                                </div>
                              </div>
                              <div className="mt-8 text-center mx-auto">
                                <button
                                  onClick={() =>
                                    router.push(
                                      "../checkout/" +
                                        blogs.Slug +
                                        "?id=" +
                                        blogs.PID +
                                        "&startDate=" +
                                        encodeURIComponent(startDate) +
                                        "&endDate=" +
                                        encodeURIComponent(endDate) +
                                        "&adults=" +
                                        adult +
                                        "&child=" +
                                        children +
                                        "&type=" +
                                        blogs.Type +
                                        "&total=" +
                                        final
                                    )
                                  }
                                  className="bg-primary text-base-100 rounded-lg px-6 py-2"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4 text-warning">
                              <p>
                                Maximum guests allowed are{" "}
                                {blogs["Total Guests"]}
                              </p>
                            </div>
                          )}
                        </>
                      ) : null}
                      {blogs.Type === "SV" && endDate ? (
                        <>
                          <p className="mt-6 font-bold">Select guests</p>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="grid col-span-2">
                              <p className="text-lg font-bold">Adults</p>
                              <p>Age 12 years & above</p>
                            </div>
                            <div className="grid col-span-1">
                              <Stepper
                                value={adult}
                                name="adult"
                                reverse={setAdult}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="grid col-span-2">
                              <p className="text-lg font-bold">Children</p>
                              <p>Between ages 5-12 years</p>
                            </div>
                            <div className="grid col-span-1">
                              <Stepper
                                value={children}
                                name="child"
                                reverse={setChildren}
                              />
                            </div>
                          </div>
                          {tg > 0 && tg <= blogs["Total Guests"] ? (
                            <button
                              onClick={() => setCheck(1)}
                              className="mt-4 text-center mx-auto justify-center py-2 px-4 bg-primary text-base-100 rounded-lg"
                            >
                              Check Availability
                            </button>
                          ) : null}
                          {tg > 0 &&
                          tg <= blogs["Total Guests"] &&
                          check == 1 ? (
                            <Availability
                              eDate={endDate}
                              sDate={startDate}
                              ptype={blogs.Type}
                              avail={setAvailable}
                              pid={blogs["PID"]}
                              adult={adult}
                              child={children}
                              cpn={setA}
                              nights={setB}
                              total={setC}
                            />
                          ) : (
                            <div className="mt-4 text-warning">
                              Maximum guests allowed are {blogs["Total Guests"]}
                            </div>
                          )}
                          {available == 0 ? (
                            <div className="mt-4 text-warning">
                              Dates are booked
                            </div>
                          ) : null}
                          {tg > 0 &&
                          tg <= blogs["Total Guests"] &&
                          available == 1 ? (
                            <div className="mt-4">
                              <p className="text-center text-lg font-bold">
                                Cost
                              </p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="grid col-span-2 gap-y-2">
                                  <p>Cost per Night</p>
                                  <p>No. of Nights</p>
                                  <p>Total Cost</p>
                                  <p className="text-sm">(Taxes additional)</p>
                                </div>
                                <div className="grid col-span-1 gap-y-2 text-right">
                                  <p>{Math.ceil(a)}</p>
                                  <p>{b}</p>
                                  <p>{Math.ceil(c)}</p>
                                  <p></p>
                                </div>
                              </div>
                              <div className="mt-8 text-center mx-auto">
                                <button
                                  onClick={() => {
                                    sendEvent(blog.Title, Math.ceil(c));
                                    router.push(
                                      "../checkout/" +
                                        blogs.Title +
                                        "?id=" +
                                        blogs.PID +
                                        "&startDate=" +
                                        encodeURIComponent(startDate) +
                                        "&endDate=" +
                                        encodeURIComponent(endDate) +
                                        "&adults=" +
                                        adult +
                                        "&type=" +
                                        blogs.Type +
                                        "&child=" +
                                        children +
                                        "&total=" +
                                        Math.ceil(c)
                                    );
                                  }}
                                  className="bg-primary text-base-100 rounded-lg px-6 py-2"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <div className="bg-base-100 h-max text-center rounded-xl shadow-xl p-6 sticky top-4">
                      <p className="text-2xl font-bold">
                        {blogs.Type === "JHS"
                          ? "₹ " + blogs["Cost per Night"]
                          : "₹ " + blogs["Cost per Night"] * multiplier}
                        <span className="text-sm font-normal">/night</span>
                      </p>
                      <p className="mt-4">
                        Maximum guests allowed are {blogs["Total Guests"]}
                      </p>
                      <p className="mt-4 text-lg font-bold">Ready to book?</p>
                      <p className="mt-4">
                        Please contact the stay manager by clicking below for
                        availability and booking
                      </p>
                      <button
                        className="bg-primary text-base-100 rounded-lg px-6 py-2 mt-4"
                        onClick={() => setsContact(true)}
                      >
                        Contact Stay Manager
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:px-0">
                <div className="divider2 " />
                <h2 className="text-2xl font-bold mt-4">
                  Do you have questions about this property?
                </h2>
                <p className="mt-2 my-6">
                  Planning to host a special event or have specific questions -
                  Our team of experienced stay managers are available Monday to
                  Saturday between 9 AM to 6 PM. Simply, click on below button
                  to submit your query!
                </p>
                <div className="text-center px-1">
                  <button
                    className="bg-base-100 outline outline-[#1F1F1F] outline-[2px] flex items-center justify-center gap-2 lg:w-fit w-full px-4 py-4 rounded-lg text-[#1F1F1F]"
                    onClick={() => setsContact(true)}
                  >
                    <OutlineCallIcon /> Connect with Host
                  </button>
                </div>
                <div className="divider2" />
              </div>
              <div className="lg:px-0">
                <h2 className="text-2xl font-bold mt-4">Reviews</h2>
                <VReview type={blogs.Type} pid={blogs.PID} />
                <div className="text-center px-1">
                  <button
                    className="bg-base-100 outline outline-[#1F1F1F] outline-[2px] flex items-center justify-center lg:w-fit w-full gap-2 px-4 py-4 rounded-lg text-[#1F1F1F]"
                    onClick={() => handleReview()}
                  >
                    Write a Review
                  </button>
                </div>
                <div className="divider2" />
              </div>
              <div className="lg:px-0">
                <h2 className="text-2xl font-bold mt-4">Property Location</h2>
                <div className="mt-4 lg:my-6">
                  <Neighborhood town={blogs.Town} />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:block hidden">
            <Footer />
          </div>
        </div>
        <SThis open={show} from={setShow} url={url} prop={blogs.Title} />
        <COModal
          open={showCheckModal}
          from={setShowCheckModal}
          blogs={blogs}
          ptype={blogs.Type}
          booked={bookedDates}
        />
        <SubmitManager
          open={showContact}
          from={setsContact}
          PID={blogs.PID}
          type={blogs.Type}
          title={blogs.Title}
        />
        <Logreg
          open={login}
          from={setLogin}
          active={setRopen}
          mobile={setUser}
          option={option}
        />
        <Logreg
          from={setShowModal}
          open={showModal}
          active={setWishlist}
          mobile={setMobile}
        />
        <SReview open={ropen} from={setRopen} />
      </div>
    );
  }
}
