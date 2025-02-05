import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { format } from "date-fns";
import axios from "axios";
import { BiCard } from "react-icons/bi";
import { LineWave } from "react-loader-spinner";
import { MultiplierContext } from "../../contexts/MultiplierContext";
import { AiFillHeart } from "react-icons/ai";
import Logreg from "../loginModal";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { capitalCase } from "change-case";
import { useCookies } from "react-cookie";

const PDCard = ({ uid, startDate, endDate, adult, child, calendar, type }) => {
  const [prop, setProp] = useState([]);
  const [arr, setArr] = useState([]);
  const [show, setShow] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const multiplier = useContext(MultiplierContext);
  const { check, getCookie, setCookie } = useCookies();
  const [isWishlist, setWishlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState(null);
  const [rowId, setrowId] = useState(null);
  const [newprice, setNewprice] = useState(null);

  const sendEvent = () => {
    window.gtag("event", "property_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a property",
      property_name: prop.Title,
    });
  };

  const setWish = () => {
    const isLoggedIn = check("isLoggedIn");
    const mobile = check("mobile");
    if (!isLoggedIn || !mobile) {
      setShowModal(true);
      return;
    }
    submitWish();
  };
  const submitWish = async () => {
    if (isWishlist === false) {
      const options = {
        method: "POST",
        url: process.env.API_URL + "Wishlist",
        headers: { "xc-token": process.env.API_KEY },
        data: {
          Type: type,
          PID: Number(uid),
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
    const pid = Number(uid);
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
    if (uid) {
      getData();
      // getData1();
    }
  }, [uid, show]);

  useEffect(() => {
    var a = getCookie("isLoggedIn");
    var b = getCookie("mobile");
    if (a && b) {
      setMobile(b);
      checkWish(b);
    }
  }, [isWishlist, showModal, mobile]);

  useEffect(() => {
    setIsVisible(show === 0);
  }, [show]);

  const getData = () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + (type === "JHS" ? "Property" : "StayVista"),
      params: {
        where: `(${type === "JHS" ? "ncRecordId" : "PID"},eq,${uid})`,
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    axios.request(options).then(function (res) {
      setProp(res.data.list[0]);
      const source =
        type === "JHS"
          ? res.data.list[0].Images
          : JSON.parse(res.data.list[0].Images);
      const url =
        type === "JHS"
          ? "/api/process-image?imageUrl=https://test.justhomestay.in/"
          : "/api/process-image?imageUrl=";
      const imgs = source
        .slice(0, 9)
        .map((item) => url + (type === "JHS" ? item.path : item));
      setArr(imgs);
      type === "JHS" ? getJavail() : getStayavail();
    });
  };

  const getStayavail = async (retries = 6, backoff = 500) => {
    const startFormatted = format(new Date(startDate), "yyyy-MM-dd");
    const endFormatted = format(new Date(endDate), "yyyy-MM-dd");
    const apiUrl = `https://api.vistarooms.com/api/v2/inventory-price?checkInDate=${startFormatted}&checkOutDate=${endFormatted}&propertyId=${uid}&adult=${adult}&child=${child}`;
    const headersList = {
      Accept: "*/*",
      apiKey: "45CF5-15516",
      secretKey: "0b202f12835710c65165de4021ae65cbdfa577b3",
    };
    if (uid) {
      try {
        const response = await axios.get(apiUrl, { headers: headersList });
        setShow(response.data.response.booking_status === 1 ? 0 : 1);
        if (response.data.response.booking_status === 1) {
          setNewprice(
            Number(response.data.response.price) /
            Number(response.data.response.date_diff_in_days)
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
          setTimeout(() => {
            getStayavail(
              retries - 1,
              backoff * Math.floor(Math.random() * 5) + 1
            );
          }, backoff);
        } else {
          setShow(0);
        }
      }
    } else {
      setShow(0);
    }
  };

  const getJavail = async () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    let showJHS = 0;
    var dateArray = new Array();
    var currentDate = startDateObj;
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    while (currentDate <= endDateObj) {
      dateArray.push(format(new Date(currentDate), "dd-MM-yyyy"));
      currentDate = currentDate.addDays(1);
    }
    let bookDatedArr = [];
    try {
      const options1 = {
        method: "GET",
        url: `http://localhost:3000/api/bookedDates?id=${prop.PID}`,
        params: {
          limit: "1000",
        },
        headers: {
          "xc-token": process.env.API_KEY,
        },
      };

      const [response1] = await Promise.all([axios.request(options1)]);
      if (response1.status === 200) {
        bookDatedArr = response1.data.bookedDates;
        for (let index = 0; index < bookDatedArr.length; index++) {
          const date = format(new Date(bookDatedArr[index]), "dd-MM-yyyy");
          if (dateArray.lastIndexOf(date) >= 0) {
            showJHS = 0;
            return;
          } else {
            showJHS = 1;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setShow(showJHS);
  };

  const [wt, ht] = useMemo(() => {
    if (typeof window !== "undefined") {
      const _wt =
        window.innerWidth > 768 ? (1140 - 64) / 3 : window.innerWidth - 48;
      const _ht = _wt * (3 / 4);
      return [_wt, _ht];
    }
    return [null, null];
  }, []);

  if (!isVisible) {
    return null;
  } else {
    return (
      <div>
        {prop && arr && prop.Title ? (
          <div className="z-10 lg:mx-2 relative rounded-xl drop-shadow-xl bg-base-100 text-neutral">
            <div className="relative">
              {arr.length ? (
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  swipeable
                  dynamicHeight
                  emulateTouch
                  infiniteLoop
                  showIndicators={false}
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
              ) : null}
              <div
                onClick={() => setWish()}
                className="absolute top-4 right-4 text-white"
              >
                {isWishlist ? (
                  <AiFillHeart className="w-8 h-8" />
                ) : (
                  <AiFillHeart className="w-8 h-8 opacity-50 text-neutral" />
                )}
              </div>
            </div>
            <div className="p-2">
              <a
                onClick={() => sendEvent()}
                className="cursor-pointer"
                href={
                  "/property/" +
                  prop.Slug +
                  "?startDate=" +
                  encodeURIComponent(startDate) +
                  "&endDate=" +
                  encodeURIComponent(endDate) +
                  "&adult=" +
                  adult +
                  "&child=" +
                  child
                }
              >
                <p className="text-sm">{capitalCase(prop.Town)}</p>
                <h3 className="text-xl font-bold pt-2">
                  {prop.Title.length > 30
                    ? prop.Title.slice(0, 30) + "..."
                    : prop.Title}
                </h3>
                <p>
                  {prop["Number of Bedrooms"]} bedrooms{" "}
                  <span className="text-2xl">·</span>{" "}
                  {prop["Number of Bathrooms"]} bathrooms{" "}
                  <span className="text-2xl">·</span> {prop["Total Guests"]}{" "}
                  guests
                </p>
                <div className="grid grid-cols-3">
                  <div className="grid col-span-2">
                    <p className="mt-4 text-sm font-light">
                      <span className="text-xl font-bold">
                        {type === "JHS"
                          ? "₹ " + prop["Cost per Night"]
                          : "₹ " + Math.round(newprice * multiplier, 0)}
                      </span>
                      /night
                    </p>
                  </div>
                  <div className="grid col-span-1">
                    {prop["Instant Booking"] === true ? (
                      <span className="text-right mt-4 ml-auto">
                        <BiCard className="w-6 h-6 text-secondary" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full text-center iconcen">
            <LineWave
              height="100"
              width="100"
              color="#0C5110"
              ariaLabel="line-wave"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              firstLineColor=""
              middleLineColor=""
              lastLineColor=""
            />
          </div>
        )}
        <Logreg
          from={setShowModal}
          open={showModal}
          active={setWishlist}
          mobile={setMobile}
        />
      </div>
    );
  }
};

export default React.memo(PDCard);
