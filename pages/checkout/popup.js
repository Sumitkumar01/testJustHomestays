import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

export default function Popup(props) {
  const [showInput, setShowInput] = useState(false);
  const { check, getCookie, setCookie } = useCookies();
  const Ref = useRef(null);
  var myHeaders = new Headers();
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");
  const [otp, setOtp] = useState(0);
  const [mobile, setMobile] = useState("");
  const [iotp, setIotp] = useState("");

  const handleChange = (event) => {
    setMobile(event.target.value);
  };

  const handleChange2 = (event) => {
    setIotp(event.target.value);
  };

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
    // alert(otp)
    setShowInput(true);
  }

  function checkOTP() {
    if (otp == iotp) {
      setCookie("isLoggedIn", "true", {
        path: "/",
        expires: 1,
      });
      setCookie("mobile", mobile, {
        path: "/",
        expires: 1,
      });
      props.from(false);
      props.mobile(mobile);
    }
  }

  function checkLogin() {
    if (getCookie("isLoggedIn")) {
      props.from(false);
      props.mobile(getCookie("mobile"));
    }
  }

  useEffect(() => {
    checkLogin();
    if (otp > 0) {
      console.log("otp generated");
    } else {
      setOtp(Math.floor(100000 + Math.random() * 900000));
    }
  }, [otp]);

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
      <div className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="modal-box rounded-xl max-w-screen-sm p-4">
          <h2 className="font-bold text-center text-lg">
            Login/Signup to continue
          </h2>

          <div className="overflow-y-auto flex flex-col gap-6 justify-center items-center mt-2 p-4">
            <input
              id="number"
              type="number"
              maxLength={10}
              placeholder="Mobile Number"
              className="rounded-xl px-4 py-4 outline-secondary outline-4 bg-base-200 md:w-1/2 w-full text-center md:text-left text-neutral"
              onChange={handleChange}
              value={mobile}
            />

            {/* ENTER OTP */}
            {showInput ? (
              <>
                <input
                  inputMode="numeric"
                  type="password"
                  placeholder="Enter OTP"
                  className="rounded-xl px-4 py-4 outline-secondary outline-4 bg-base-200 md:w-1/2 w-full text-neutral text-center md:text-left"
                  maxLength={6}
                  onChange={handleChange2}
                  value={iotp}
                />
                <div className="flex mx-10 justify-center items-center text-warning flex-row gap-4 ">
                  {timer === "00:00:00" && (
                    <button
                      onClick={onClickReset}
                      className="underline font-semibold"
                    >
                      Resend OTP
                    </button>
                  )}
                  {timer}
                </div>
              </>
            ) : null}
            <p className="text-base font-semibold md:text-left text-center">
              by continuing, you agree to the{" "}
              <a href="#" target="_blank" className="underline text-primary">
                T&C
              </a>{" "}
              and{" "}
              <a href="#" target="_blank" className="underline text-primary">
                Privacy Policy
              </a>{" "}
              of Just Home Stay
            </p>
            {/* SEND OTP */}
            {!showInput ? (
              <button
                onClick={() => {
                  sendOTP();
                }}
                className="bg-primary text-base-100 px-4 py-2 rounded"
              >
                Send OTP
              </button>
            ) : (
              //RESEND OTP
              <button
                onClick={() => {
                  setShowInput(true);
                  checkOTP();
                }}
                className="bg-primary text-base-100 px-4 py-2 rounded-lg"
              >
                Verify OTP
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
