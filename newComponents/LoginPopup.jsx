"use client";
import Link from "next/link";
import { CloseButton } from "../util/icons";
import { countries } from "../util/countryCode";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios";

const LoginPopup = ({ showLoginPopup, setShowLoginPopup }) => {
  useEffect(() => {
    if (showLoginPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginPopup]);
  const [countryCode, setCountryCode] = useState("+91");

  const [showInput, setShowInput] = useState(false);
  const Ref = useRef(null);
  var myHeaders = new Headers();
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  const router = useRouter();

  const [otp, setOtp] = useState(0);
  const [mobile, setMobile] = useState("");
  const [iotp, setIotp] = useState("");
  const [valid, setValid] = useState(null);
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);

  const [otpVisible, setOtpVisible] = useState(false);

  const handleChange = (event) => {
    setMobile(event.target.value);
  };

  const handleChange2 = (event) => {
    setIotp(event.target.value);
  };

  function sendOTP() {
    clearTimer(getDeadTime());
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

    if (response.status === 200 && response.data.pageInfo.totalRows > 0) {
      // Set cookies if needed
      setCookie("isLoggedIn", "true", {
        path: "/",
        expires: new Date(Date.now() + 86400000), // Expires in 1 day
        sameSite: "None",
        secure: true, // Add secure flag for HTTPS
      });
      setCookie("mobile", mobile, {
        path: "/",
        expires: new Date(Date.now() + 86400000), // Expires in 1 day
        sameSite: "None",
        secure: true, // Add secure flag for HTTPS
      });
      setValid(1);
    } else {
      setValid(0);
    }
  }

  useEffect(() => {
    if (valid === 1) {
      router.push("/user/details?user=" + mobile);
    }
  }, [valid]);

  function checkOTP() {
    if (otp === Number(iotp)) {
      checkUser();
    }
  }

  // The state for our timer
  const [timer, setTimer] = useState("");

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
    var a = cookies.isLoggedIn;
    var b = cookies.mobile;
    if (a && b) {
      router.push("./details?user=" + b);
    }
  }, []);

  useEffect(() => {
    if (otp === 0) {
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
    setTimer("00:00:20");

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

  // useEffect(() => {
  //   clearTimer(getDeadTime());
  // }, []);

  const onClickReset = () => {
    clearTimer(getDeadTime());
    sendOTP();
  };

  return (
    <div
      className="fixed z-40 px-4 py-2 w-full h-full bottom-0 left-0 md:hidden bg-black/50 transition-all duration-300 ease-in-out"
      draggable="true"
      onTouchMove={() => setShowLoginPopup(false)}
    >
      <div
        className={`flex flex-col gap-4 bg-white py-4 overflow-hidden fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out rounded-tr-xl rounded-tl-xl ${showLoginPopup
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-full"
          }`}
      >
        <div className="flex flex-col gap-4 w-full h-full border-b border-gray-200 p-4">
          <button
            className="w-full flex items-center justify-center text-white rounded-md"
            onClick={() => setShowLoginPopup(false)}
          >
            <CloseButton />
          </button>
          <h2 className="text-xl">Login/Signup</h2>
        </div>
        <div className="flex flex-col gap-4 px-4 pt-6 pb-10">
          {/* MOBILE INPUT  */}
          {valid === 0 ? null : (
            <>
              {/* <input
                type="number"
                id="number"
                onChange={handleChange}
                maxLength={10}
                placeholder="Mobile Number"
                className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full md:w-3/4 text-neutral text-center"
                value={mobile}
              /> */}
              <div className="flex gap-2 border border-[##D6D6D6] rounded-md overflow-hidden">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent rounded-lg text-[#333333] focus:outline-none w-1/2 p-2"
                >
                  {countries.map((country, index) => (
                    <option
                      key={index}
                      value={country.code}
                      className="text-[#b4b4b4]  bg-gray-100"
                    >
                      {`${country.code} ${country.name}`}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  id="number"
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Mobile Number"
                  className="w-full p-2 bg-white border-l-2 border-[#D6D6D6] focus:outline-none"
                  value={mobile}
                />
              </div>

              {/* OTP INPUT  */}
              {showInput ? (
                <div className="flex gap-2 flex-col items-center w-full">
                  <div className="flex items-center justify-center w-full md:w-3/4">
                    <input
                      inputMode="numeric"
                      type={otpVisible ? "text" : "password"}
                      placeholder="Enter OTP"
                      className="w-full p-2 bg-white border text-center border-[#D6D6D6] focus:outline-none"
                      maxLength={6}
                      onChange={handleChange2}
                      value={iotp}
                    />
                    <button
                      onClick={() => setOtpVisible(!otpVisible)}
                      className="ml-2"
                    >
                      {otpVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
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
            </>
          )}

          {/* SEND OTP  */}
          {!showInput ? (
            <button
              onClick={() => {
                sendOTP();
              }}
              disabled={mobile.length < 10}
              className="hover:bg-base-100 hover:text-primary  btn p-4 bg-primary text-white rounded-md  "
            >
              Send OTP
            </button>
          ) : (
            //VERIFY_OTP
            <div className="mx-auto text w-full">
              {valid === 0 ? (
                <p className="text-center">
                  We apologize, we couldn't find a user with the mobile number.{" "}
                  <span
                    onClick={() => {
                      router.push("./register?mobile=" + mobile);
                    }}
                    className="font-bold underline underline-offset-2 cursor-pointer"
                  >
                    Register?
                  </span>
                </p>
              ) : (
                <button
                  onClick={checkOTP}
                  className="hover:bg-base-100 hover:text-primary  btn p-4 bg-primary text-white rounded-md w-full "
                >
                  Verify OTP
                </button>
              )}
            </div>
          )}
          <p className="text-[#6D6D6D] text-sm">
            By signing up, you agree to our{" "}
            <Link href="href" className="border-b-2 border-[#6D6D6D]">
              terms & conditions
            </Link>{" "}
            and{" "}
            <Link href="href" className="border-b-2 border-[#6D6D6D]">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;