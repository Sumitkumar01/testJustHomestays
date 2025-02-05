import React, { useState, useEffect } from "react";
import axios from "axios";
import Upcoming from "./Upcoming";
import Cancelled from "./Cancelled";
import Completed from "./Completed";
import { RiSuitcaseLine, RiCheckboxLine } from "react-icons/ri";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Header from "../header";
import Footer from "../Footer.jsx";
import { useCookies } from "react-cookie"; // Import useCookies from react-cookie
import { useRouter } from "next/router";
import BottomFooter from "../../newComponents/BottomFooter";

const TABS = [
  {
    name: "Upcoming",
    filter: (booking) =>
      booking.Status === "Booked" && new Date(booking.From) > new Date(),
    component: Upcoming,
    icon: <RiSuitcaseLine size={25} />,
  },
  {
    name: "Cancelled",
    filter: (booking) => booking.Status === "Cancelled",
    component: Cancelled,
    icon: <RiCheckboxLine size={25} />,
  },
  {
    name: "Completed",
    filter: (booking) =>
      booking.Status === "Booked" && new Date(booking.From) < new Date(),
    component: Completed,
    icon: <MdOutlineCancelPresentation size={25} />,
  },
];

export function useUserDetails(mobile) {
  const [user, setUser] = useState([]);
  useEffect(() => {
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
        setUser(response.data.list[0]);
      }
    }
    if (mobile) {
      checkUser();
    }
  }, [mobile]);
  return user;
}



function useBookings(mobile) {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      const options2 = {
        method: "GET",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Bookings",
        params: { where: "(Mobile,eq," + mobile + ")" },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };
      const response = await axios.request(options2);
      setBookings(response.data.list);
    };
    if (mobile) {
      fetchBookings();
    }
  }, [mobile]);
  return bookings;
}

export default function Details() {
  const [tab, setTab] = useState(0);
  const router = useRouter();

  // Use react-cookie's useCookies hook
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);

  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    setMobile(new URLSearchParams(window.location.search).get("user"));
  }, []);

  const user = useUserDetails(mobile);
  const bookings = useBookings(mobile);

  function logout() {
    // Delete cookies by setting them to null and specifying an expires date in the past
    setCookie("isLoggedIn", null, {
      path: "/",
      sameSite: "None",
      expires: new Date(0),
      secure: true,
    });
    setCookie("mobile", null, {
      path: "/",
      sameSite: "None",
      expires: new Date(0),
      secure: true,
    });
    router.push("/");
  }

  const CurrentTabComponent = TABS[tab].component;

  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full">
        <Header />
        <div>
          <div className="bg-base-100 rounded-2xl h-50 max-w-screen-xl p-2 md:p-4 text-right">
            {/* Heading  */}
            <div className="navbar border-b-4  border-slate-100 grid md:grid-cols-3 lg:grid-cols-2 grid-cols-1 bg-base-100">
              {/* Left  */}
              <div className="tabs justify-start items-center md:col-span-2 lg:col-span-1   flex-row gap-2 font-bold hidden md:flex">
                {TABS.map(({ name, icon }, index) => (
                  <a
                    onClick={() => setTab(index)}
                    key={index}
                    className={`tab hover:border-b-4 text-lg hover:text-green-900 hover:border-yellow-500 ${tab === index ? "active" : ""
                      }`}
                  >
                    <span className="mx-1 lg:mx-2">{icon}</span>
                    <span>{name}</span>
                  </a>
                ))}
              </div>
              {/* Right  */}
              <div className="col-span-1 flex flex-col md:flex-row justify-self-end gap-4 items-center  ">
                {/* Profile  */}
                <div className="flex flex-row justify-center items-center ">
                  <h1 className="font-bold text-lg">Hi, {user.Name}</h1>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-md avatar">
                      <div className="w-10 rounded bg-yellow-500 p-2 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a className="justify-between">
                          Profile
                          <span className="badge">New</span>
                        </a>
                      </li>
                      <li>
                        <a>Settings</a>
                      </li>
                      <li>
                        <a onClick={() => logout()}>Logout</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* BODY  */}
            <div className="overflow-y-auto flex w-full flex-col justify-center items-center mt-2 text-justify p-4">
              <CurrentTabComponent list={bookings.filter(TABS[tab].filter)} />
            </div>
          </div>
        </div>
        <div className="lg:hidden block">
          <BottomFooter />
        </div>
        <div className="lg:block hidden">
          <Footer />
        </div>
      </div>
    </div>
  );
}
