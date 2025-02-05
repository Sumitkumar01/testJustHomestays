import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import SRooms from "../components/roomsettingsjhs";

export default function Amenities() {
  const router = useRouter();
  const [existing, setExisting] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();
  const [data, setData] = useState();
  const [count, setCount] = useState(0);
  const [reset, setReset] = useState(false);

  const getData = (options) => {
    axios.request(options).then(function (res) {
      setExisting(res.data.list[0]["Bedrooms List"]);
      setData(res.data.list[0].Images);
      setCount(res.data.list[0]["Number of Bedrooms"]);
    });
  };

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
      params: {
        limit: "1000",
        where: "(ncRecordId,eq," + id + ")",
        sort: "Town",
      },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    getData(options);
  }, [reset]);

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  }, []);

  if (isLoggedIn) {
    const logOutHandler = () => {
      deleteCookie("isAdminLoggedIn");
      router.push("/management/login");
    };
    return (
      <div className="flex w-[80%] flex-col justify-center items-center mx-auto ">
        <SRooms
          images={data}
          count={count}
          existing={existing}
          logout={logOutHandler}
          ptype="JHS"
          reset={reset}
          setreset={setReset}
        />
      </div>
    );
  } else {
    return (
      <>
        <div className="w-full h-[100vh] ">
          <div className="flex flex-col  justify-center items-center mx-auto w-[30%] mt-[10%]">
            <h1 className="font-semibold text-2xl py-10">
              To get access login first
            </h1>
            <a href="/management/login">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Login First
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }
}
