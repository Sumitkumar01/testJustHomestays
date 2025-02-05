import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Logreg(props) {
  const [mobile, setMobile] = useState("");
  const [otpinput, setOtpinput] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [iotp, setiOtp] = useState("");
  const [otp, setOtp] = useState(0);
  const [valid, setValid] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const option = props.option;

  // Use react-cookie's useCookies hook
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  async function submitForm() {
    const options = {
      method: "POST",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Users",
      headers: {
        "Content-Type": "application/json",
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
      data: {
        Mobile: mobile,
        Name: name,
        EmailID: email,
        City: city,
      },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
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
    if (otp === 0) {
      setOtp(Math.floor(100000 + Math.random() * 900000));
    }
  }, [otp]);

  var myHeaders = new Headers();
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const sendMessage = () => {
    fetch(
      "https://www.fast2sms.com/dev/bulkV2?authorization=EloTOJcYQse0y2vh6I7nZ8PHqgi9NKSBdUa3MkLXDR1mWjzfxtjGm7wtUuogX2p0qDSscBnviTJeNdL6&variables_values=" +
        otp +
        "&route=otp&numbers=" +
        mobile,
      requestOptions
    ).then(function (response) {
      return response.json();
    });
    setOtpinput(true);
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

    if (response.status === 200 && response.data.pageInfo.totalRows > 0) {
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
      props.from(false);
      props.active(true);
      props.mobile(mobile);
    }
  }, [valid]);

  const verifyOtp = () => {
    if (otp === Number(iotp)) {
      checkUser();
    }
  };

  if (props.open) {
    return (
      <div className="backdrop justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="md:w-1/3 w-full self-center md:min-h-1/4 md:max-h-max bottom-0 mx-2 md:mx-0 px-4 py-6 text-right scale-100 bg-white z-50 rounded-xl">
          <h4 className="text-xl font-bold text-center">{props.option === "review" ? 'Add a Review?' : 'Add to Wishlist?'}</h4>
          <p className="text-base text-center py-2">
            An account will help you to securely access your trips, submit reviews, and create wishlist
            on this and other devices
          </p>
          <div className="mx-auto flex-col w-[80%] gap-4 mt-4 text-center justify-center">
            <input
              type="number"
              id="number"
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              placeholder="Mobile Number"
              className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full text-neutral text-center"
            />
            {mobile.length === 10 && !otpinput ? (
              <button
                onClick={() => sendMessage()}
                className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-sm mt-4"
              >
                Get OTP
              </button>
            ) : null}
            {!otpinput ? null : (
              <>
                <div className="flex gap-2 flex-col mt-4 items-center w-full">
                  <div className="flex items-center justify-center w-full">
                    <input
                      inputMode="numeric"
                      type={otpVisible ? "text" : "password"}
                      placeholder="Enter OTP"
                      className="rounded-xl px-4 py-2 outline-secondary outline-4 bg-base-200 text-neutral text-center flex-grow"
                      maxLength={6}
                      onChange={(e) => setiOtp(e.target.value)}
                      value={iotp}
                    />
                    <button
                      onClick={() => setOtpVisible(!otpVisible)}
                      className="ml-2"
                    >
                      {otpVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                {valid === 0 ? null : (
                  <button
                    onClick={() => verifyOtp()}
                    className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-sm mt-4"
                  >
                    Verify OTP
                  </button>
                )}
              </>
            )}
            {valid === 0 ? (
              <>
                <div className="flex gap-2 flex-col mt-4 items-center w-full">
                  <div className="flex-col gap-4 items-center justify-center w-full">
                    <input
                      type="text"
                      placeholder="Name"
                      className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full text-neutral text-center"
                      value={name}
                      onChange={handleChange(setName)}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full mt-4 text-neutral text-center"
                      value={email}
                      onChange={handleChange(setEmail)}
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full mt-4 text-neutral text-center"
                      value={city}
                      onChange={handleChange(setCity)}
                    />
                    <button
                      onClick={submitForm}
                      className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-sm mt-4"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            ) : null}
            <div
              onClick={() => props.from(false)}
              className="mt-4 text-neutral text-sm text-center py-2 w-full font-bold cursor-pointer"
            >
              Not now, thanks
            </div>
          </div>
        </div>
      </div>
    );
  }
}
