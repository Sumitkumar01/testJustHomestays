import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie"; // Import useCookies from react-cookie
import Logreg from "./loginModal";
import Header from "./header";
import Footer from "./Footer.jsx";
import Image from "next/image";
import imag from "../public/wishlist_login.webp";
import axios from "axios";
import PHCard from "./propCard.js";
import PropertyCard from "../newComponents/PropertyCard.jsx";

export default function Wishlist() {
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState(null);
  const [temp, setTemp] = useState(null);
  const [prop, setProp] = useState([]);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    if (cookies.isLoggedIn && cookies.mobile) {
      setMobile(cookies.mobile);
    }
  }, [cookies]);

  useEffect(() => {
    if (mobile) {
      getList();
    }
  }, [mobile]);

  const getList = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Wishlist",
      headers: { "xc-token": process.env.API_KEY },
      params: {
        where: "(Mobile,eq," + mobile + ")",
        sort: "-AddedOn",
      },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      setRows(response.data.pageInfo.totalRows);
      // console.log(response);
      setProp(response.data.list);
    }
  };

  console.log("wish", prop)

  if (prop) {
    return (
      <div className="flex justify-center">
        <div className="lg:w-[1140px] w-full md:px-0 px-4">
          <Header />
          <div className="w-full text-center text-3xl font-bold text-primary">
            <h1>Wishlist</h1>
          </div>
          {!mobile ? (
            <div className="flex p-4 bg-white drop-shadow-xl rounded-xl w-full mt-4 gap-x-8">
              <Image
                src={imag}
                width={800}
                height={800}
                className="basis-1/2 w-1/2"
                alt="Wishlist Login | JHS"
              />
              <div className="my-auto">
                <p className="text-2xl text-primary font-bold">
                  Oops, it seems you are not logged in yet!
                </p>
                <br />
                <p className="text-xl">
                  Please login to check your favorite Just Home Stay
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-md mt-8"
                >
                  Login
                </button>
              </div>
            </div>
          ) : null}
          {mobile && rows > 0 ? (
            <div className="grid md:grid-cols-3 grid-cols-1 gap-x-2 gap-y-4 my-4">
              {prop.map((props, index) => {
                return (
                  // <PHCard key={index} property={props} type={props.Type} />
                  <PropertyCard property={props} type={props.Type} key={index} />
                );
              })}
            </div>
          ) : null}
          {mobile && rows === 0 ? (
            <div className="w-full text-center mt-4">
              <p className="text-2xl text-primary font-bold">
                It looks empty, are you done exploring?
              </p>
              <a href="/">
                <button className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-md mt-8">
                  If No? Click Here
                </button>
              </a>
            </div>
          ) : null}
          <Footer />
          <Logreg
            open={showModal}
            from={setShowModal}
            active={setTemp}
            mobile={setMobile}
          />
        </div>
      </div>
    )
  }
}
