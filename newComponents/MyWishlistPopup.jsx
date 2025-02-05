"use client";
import { CloseButton } from "../util/icons";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import PHCard from "../pages/propCard";
import axios from "axios";
import { useCookies } from "react-cookie";
const MyWishlistPopup = ({ showWishlistPopup, setShowWishlistPopup }) => {
  useEffect(() => {
    if (showWishlistPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showWishlistPopup]);
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);
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


  console.log("wish popup", prop)
  return (
    <div
      className={`fixed z-20 px-4 py-2 w-full h-full bottom-0 left-0 md:hidden bg-black/60 filter backdrop-blur-sm 
           transition-all duration-300 ease-in-out`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowWishlistPopup(false);
      }}
    >
      <div
        className={`flex flex-col gap-4 bg-white py-4 overflow-hidden  ${showWishlistPopup ? " scale-100" : "scale-95 "
          } fixed bottom-0 left-0 w-full  transform transition-transform duration-700 ease-in-out rounded-tr-3xl rounded-tl-3xl shadow-inner`}
      >
        <button
          className="w-full flex items-center justify-center border-none bg-transparent"
          onClick={() => setShowWishlistPopup(false)}
        >
          <CloseButton />
        </button>
        <div className=" border-[#D6D6D6] pb-4 w-full h-full px-4 border-b">
          <h2 className="text-xl">My Wishlist</h2>
        </div>
        <div
          className="flex flex-col gap-4 overflow-y-auto h-full px-2 overflow-x-hidden overflow-scroll"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {mobile && rows > 0 ? (
            <div className="flex flex-col gap-5">
              {prop.map((item, index) => (
                <div key={item.index}>
                  {/* {index} */}
                  {/* <PropertyCard property={item} type={item.Type} /> */}
                  {/* <PropertyCard property={props} type={props.Type} key={index} /> */}
                  {/* <PHCard type={item.Type} property={item} /> */}

                  <PropertyCard property={item} type={item.Type} key={index} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyWishlistPopup;
