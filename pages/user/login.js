import axios from "axios";
import Footer from "../Footer.jsx";
import Header from "../header";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Account() {
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
      router.push("./details?user=" + mobile);
    }
  }, [valid]);

  function checkOTP() {
    if (otp === Number(iotp)) {
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
    sendOTP();
  };
  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full">
        <Header />
        <div>
          <div className="relative mx-4">
            <img
              src="https://cdn.pixabay.com/photo/2016/12/30/23/07/manali-1941787_960_720.jpg"
              className="w-full rounded-3xl md:aspect-[16/6] aspect-square object-cover "
              alt="manali"
            />
            <div className="justify-center items-center flex outline-none focus:outline-none -mt-24 m-auto w-full">
              <div className="bg-base-100 rounded-2xl p-4 text-right md:basis-1/2 drop-shadow-xl">
                {valid === 0 ? null : (
                  <h1 className="font-bold text-center text-lg">
                    Enter mobile number to continue
                  </h1>
                )}
                <div className="overflow-y-auto flex flex-col gap-6 justify-center items-center mt-2 text-justify p-4">
                  {/* MOBILE INPUT  */}
                  {valid === 0 ? null : (
                    <>
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
                          <div className="flex items-center justify-center w-full md:w-3/4">
                            <input
                              inputMode="numeric"
                              type={otpVisible ? "text" : "password"}
                              placeholder="Enter OTP"
                              className="rounded-xl px-4 py-2 outline-secondary outline-4 bg-base-200 text-neutral text-center flex-grow"
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
                      className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-sm"
                    >
                      Send OTP
                    </button>
                  ) : (
                    //VERIFY_OTP
                    <div className="mx-auto text">
                      {valid === 0 ? (
                        <p className="text-center">
                          We apologize, we couldn't find a user with the mobile
                          number.{" "}
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
                          className="bg-primary hover:bg-base-100 px-4 py-2 text-white hover:text-primary outline outline-primary btn"
                        >
                          Verify OTP
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
