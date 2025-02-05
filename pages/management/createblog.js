import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import TextEditor2 from "../components/TextEditor4";
import { useRouter } from "next/router";

export default function newBlog() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();

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
        <TextEditor2 desc={""} logOut={logOutHandler} />
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
                Login
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }
}
