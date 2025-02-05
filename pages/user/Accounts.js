import React, { useEffect, useState } from "react";
import Details from "./details";
import Login from "./login";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const Accounts = () => {
  const [cookies] = useCookies(["isLoggedIn", "mobile"]);
  const router = useRouter();

  useEffect(() => {
    var a = cookies.isLoggedIn;
    var b = cookies.mobile;
    if (!a && !b) {
      router.push("./login");
    } else {
      router.push("./details?user=" + b);
    }
  }, []);
};

export default Accounts;
