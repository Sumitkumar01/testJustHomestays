import axios from "axios";
import Footer from "../Footer.jsx";
import Header from "../header";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie"; // Import useCookies from react-cookie

export default function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  
  // Use react-cookie's useCookies hook
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);
  const router = useRouter();

  // Parse mobile from the url's query
  const mobile = router.query.mobile;

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
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Expires in 1 day
        sameSite: "None",
        secure: true, // Use secure cookies if your site is served over HTTPS
      });
      setCookie("mobile", mobile, {
        path: "/",
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Expires in 1 day
        sameSite: "None",
        secure: true, // Use secure cookies if your site is served over HTTPS
      });

      // Redirect if needed
      router.push("./details?user=" + mobile);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full">
        <Header />
        <div className="relative mx-4">
          <img
            src="https://cdn.pixabay.com/photo/2016/12/30/23/07/manali-1941787_960_720.jpg"
            className="w-full rounded-3xl md:aspect-[16/6] aspect-square object-cover "
            alt="manali"
          />
          <div className="justify-center items-center flex outline-none focus:outline-none -mt-24 m-auto w-full">
            <div className="bg-base-100 rounded-2xl p-4 text-right md:basis-1/2 drop-shadow-xl">
              <h1 className="font-bold text-center text-lg">
                Enter your details to continue
              </h1>
              <div className="overflow-y-auto flex flex-col gap-6 justify-center items-center mt-2 text-justify p-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full md:w-3/4 text-neutral text-center"
                  value={name}
                  onChange={handleChange(setName)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full md:w-3/4 text-neutral text-center"
                  value={email}
                  onChange={handleChange(setEmail)}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="rounded-xl px-3 py-2 outline-secondary outline-4 bg-base-200 w-full md:w-3/4 text-neutral text-center"
                  value={city}
                  onChange={handleChange(setCity)}
                />
                <button
                  onClick={submitForm}
                  className="bg-primary hover:bg-base-100 text-base-100 hover:text-primary outline outline-primary btn btn-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
