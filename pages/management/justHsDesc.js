import React, { useState, useEffect } from "react";
import TextEditor2 from "../components/TextEditor2";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const justHsDesc = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  },[]);


  const getData = (options) => {
    axios.request(options).then(function (res) {
      setData(res.data.list[0]['Long Description']);
    });
  };

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
      params: { limit: "1000", where: "(PID,eq," + id + ")", sort: "Town" },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo"
      }
    };
    getData(options);
  }, []);

  if (isLoggedIn) {
    const logOutHandler = () => {
      deleteCookie("isAdminLoggedIn");
      router.push("/management/login");
    };
    return (
      <div className="flex w-[80%] flex-col justify-center items-center mx-auto ">
        <TextEditor2 desc={data}  logOut={logOutHandler} />
      </div>
    );
  } else {
    return (
      <>
        <div className="w-full h-[100vh] ">
          <div className="flex flex-col  justify-center items-center mx-auto w-[30%] mt-[10%]">
            <h1 className="font-semibold text-2xl py-10">To get access login first</h1>
            <a href="/management/login">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Login 
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }
}

export default justHsDesc