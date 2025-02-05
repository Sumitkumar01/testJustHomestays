import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Details from "./user/details";
import { useRouter } from "next/router";
import Login from "./user/login";
import { BsXLg } from "react-icons/bs";
import { useCookies } from "react-cookie";

const DeskModal = (props) => {
  const Ref = useRef(null);
  var myHeaders = new Headers();
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  const router = useRouter();
  const [login, setLogin] = useState(false);
  const [detail, setDetail] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [otp, setOtp] = useState(0);
  const [mobile, setMobile] = useState("");
  const [iotp, setIotp] = useState("");
  const [valid, setValid] = useState();
  const { check, getCookie, setCookie } = useCookies();

  const handleChange = (event) => {
    setMobile(event.target.value);
  };

  const handleChange2 = (event) => {
    setIotp(event.target.value);
  };

  function sendOTP() {
    fetch(
      "https://www.fast2sms.com/dev/bulkV2?authorization=EloTOJcYQse0y2vh6I7nZ8PHqgi9NKSBdUa3MkLXDR1mWjzfxtjGm7wtUuogX2p0qDSscBnviTJeNdL6&variables_values=" +
        otp +
        "&route=otp&numbers=" +
        mobile,
      requestOptions
    ).then(function (response) {
      return response.json();
    });
    setShowInput(true);
  }

  var myHeaders2 = new Headers();
  myHeaders2.append("Authorization", "Bearer keyqr8i1QluuOLwTR");
  var requestOptions2 = {
    method: "GET",
    headers: myHeaders2,
  };

  async function checkUser() {
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Users",
      params: { where: "(Mobile,eq," + mobile + ")" },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    const response = await axios.request(options);

    if (response.status === 200) {
      setCookie("isLoggedIn", "true", {
        path: "/",
        expires: 1,
      });
      setCookie("mobile", mobile, {
        path: "/",
        expires: 1,
      });
      setValid(1);
    } else {
      setValid(0);
    }
  }

  if (valid == 1) {
    props.from(false);
  }

  function checkOTP() {
    if (otp == iotp) {
      checkUser();
    }
  }

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  useEffect(() => {
    var a = getCookie("isLoggedIn");
    var b = getCookie("mobile");
    if (a && b) {
      setLogin(true);
    }
  }, []);

  useEffect(() => {
    if (otp > 0) {
      console.log("otp generated");
    } else {
      setOtp(Math.floor(100000 + Math.random() * 900000));
    }
  }, [otp]);

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("00:00:00");

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 20);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  if (props.open) {
    return (
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        className="backdrop justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="max-w-full w-full bottom-0  p-4 text-right scale-100  h-max min-h-screen z-50">
          <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
              onClick={() => props.from(false)}
            >
              <BsXLg className="h-6 w-6" />
            </button>
          </div>
          <div>
            <div className="flex justify-center">
              <div className="lg:w-[1140px] w-full">
                <div>
                  <div className="relative mx-2">
                    <div className="justify-center items-center flex outline-none focus:outline-none  mx-8">
                      <div className="bg-base-100 rounded-2xl  max-w-screen-lg md:w-1/3  p-4 text-right drop-shadow-xl">
                        <h1 className="font-bold text-center text-lg">
                          Enter mobile number to continue
                        </h1>
                        <div className="overflow-y-auto flex flex-col gap-6 justify-center items-center mt-2 text-justify p-4">
                          {/* MOBILE INPUT  */}
                          <input
                            type="number"
                            id="number"
                            onChange={handleChange}
                            maxLength={10}
                            placeholder="Mobile Number"
                            className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full md:w-3/4 text-neutral text-center"
                            value={mobile}
                          />

                          {/* OTP INPUT  */}
                          {showInput ? (
                            <div className="flex gap-2 flex-col items-center w-full">
                              <input
                                inputMode="numeric"
                                type="password"
                                placeholder="Enter OTP"
                                className="rounded-xl px-4 py-2 outline-secondary outline-4 bg-base-200 w-full md:w-3/4 text-neutral text-center"
                                maxLength={6}
                                onChange={handleChange2}
                                value={iotp}
                              />
                              {/* RESEND OTP  */}

                              <div className="flex  my-2 justify-center items-center text-red-800  flex-row gap-4 ">
                                {timer === "00:00:00" && (
                                  <button
                                    onClick={onClickReset}
                                    className="underline font-semibold"
                                  >
                                    Resend OTP
                                  </button>
                                )}

                                {/* TIMER  */}
                                {timer}
                              </div>
                            </div>
                          ) : null}

                          {/* SEND OTP  */}
                          {!showInput ? (
                            <button
                              onClick={() => {
                                sendOTP();
                              }}
                              className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-sm"
                            >
                              Send OTP
                            </button>
                          ) : (
                            //VERIFY_OTP
                            <button
                              onClick={checkOTP}
                              className="bg-primary hover:bg-base-100 px-4 py-2 text-white hover:text-primary outline outline-primary btn"
                            >
                              Verify OTP
                            </button>
                          )}
                          {valid == 0 ? (
                            <div className="w-[80%] text-red-600 text-center">
                              <p>
                                User not found, please make a booking to regster
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DeskModal;
