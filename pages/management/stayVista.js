import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AllPhotos from "../components/AllPhotos";
import { useCookies } from "react-cookie";

const stayVista = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  },[]);

  if (isLoggedIn) {
    const logOutHandler = () => {
      deleteCookie("isAdminLoggedIn");
      router.push("/management/login");
    };
    return <AllPhotos logOut={logOutHandler} />;
  } else {
    return (
      <>
        <div className="w-full h-[100vh] ">
          <div className="flex flex-col  justify-center items-center mx-auto w-[30%] mt-[10%]">
            <h1 className="font-semibold text-2xl py-10">To get access login first</h1>
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
};

export default stayVista;
