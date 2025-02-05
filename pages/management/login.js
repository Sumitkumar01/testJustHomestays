import React, { useState, useEffect } from "react";
import AllPhotos from "../components/AllPhotos";
import axios from "axios";
import Header from "../header";
import Footer from "../Footer.jsx";
import LoginForm from "../components/LoginForm";
import AdminHome from "../components/AdminHome";
import Cookies from "js-cookie";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [adminData, setAdminData] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  const data = {
    method: "GET",
    url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/AdminData/views/AdminData",
    params: { where: "(Email,eq," + enteredEmail + ")" },
    headers: {
      "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
    },
  };

  const getData = () => {
    axios.request(data).then(function (res) {
      setAdminData(res.data.list[0]);
    });
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(enteredEmail.includes("@"));
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [enteredEmail]);

  useEffect(() => {
    getData();
    let a = Cookies.get("isAdminLoggedIn");
    if (a) {
      setIsLoggedIn(true);
    }
  }, [enteredEmail, isLoggedIn]);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (enteredEmail.length === 0 && enteredPassword.length === 0) {
      alert("Enter Email and passwword");
      return;
    }
    if (enteredEmail.length === 0) {
      alert("Enter Email");
      return;
    }
    if (enteredPassword.length === 0) {
      alert("Enter Password");
      return;
    }
    if (!adminData) {
      alert("Enter correct Email and Password");
      return;
    }

    if (
      adminData.Email === enteredEmail &&
      adminData.Password === enteredPassword
    ) {
      Cookies.set("isAdminLoggedIn", "true", { expires: 1 / 4 });
    } else {
      alert("Enter correct Email and Password");
      return;
    }

    setEnteredEmail("");
    setEnteredPassword("");
  };

  const logOutHandler = (e) => {
    setIsLoggedIn(e);
  };

  return (
    <>
      {!isLoggedIn && (
        <LoginForm
          emailHandler={emailChangeHandler}
          passwordhandler={passwordChangeHandler}
          submitBtn={submitHandler}
          formIsValid={formIsValid}
          email={enteredEmail}
          password={enteredPassword}
        />
      )}
      {isLoggedIn && <AdminHome logOut={logOutHandler} />}
    </>
  );
}
