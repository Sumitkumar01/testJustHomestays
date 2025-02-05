"use client";
import { useState } from "react";
import { SearchIcon, SupportIcon, UserIcon, WishlistIcon } from "../util/icons";
import LoginPopup from "./LoginPopup";
import MyWishlistPopup from "./MyWishlistPopup";
import { useCookies } from "react-cookie";
import SearchByProperty from "./SearchByProperty";
import { useRouter } from "next/router";
const BottomFooter = () => {
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [showSearchByProperty, setShowSearchByProperty] = useState(false);
  const [cookies] = useCookies(["isLoggedIn", "mobile"]);
  const isLoggedIn = cookies.isLoggedIn;
  const data = [
    {
      id: 1,
      title: "Search",
      icon: <SearchIcon />,
      onclick: () => {
        setShowSearchByProperty(!showSearchByProperty);
      },
    },
    {
      id: 2,
      title: "Wishlist",
      icon: <WishlistIcon />,
      onclick: () => {
        if (isLoggedIn) {
          setShowWishlistPopup(!showWishlistPopup);
        } else {
          setShowLoginPopup(true);
        }
      },
    },
    {
      id: 3,
      title: "Account",
      icon: <UserIcon />,
      onclick: () => {
        if (isLoggedIn) {
          router.push("/user/Accounts");
        } else {
          setShowLoginPopup(true);
        }
      },
    },
    {
      id: 4,
      title: "Support",
      icon: <SupportIcon />,
      onclick: () => {
        window.open(
          "https://wa.me/919810325245?text=I%20need%20help%20with%20JustHomeStay",
          "_blank"
        );
      },
    },
  ];
  return (
    <>
      <div className="fixed z-30 px-4 py-2 bg-white w-full rounded-md bottom-0 left-0 md:hidden drop-shadow-[0_-5px_10px_rgba(0,0,0,0.25)]">
        <div className="mx-auto">
          <div className="grid grid-cols-4 text-center">
            {data.map((item) => (
              <div
                key={item.id}
                className="text-center justify-center cursor-pointer flex flex-col items-center"
                onClick={item.onclick}
              >
                {item.icon}
                <p className="text-black text-sm font-normal mt-1">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <LoginPopup
          showLoginPopup={showLoginPopup}
          setShowLoginPopup={setShowLoginPopup}
        />
      )}
      {showWishlistPopup && (
        <MyWishlistPopup
          showWishlistPopup={showWishlistPopup}
          setShowWishlistPopup={setShowWishlistPopup}
        />
      )}

      {showSearchByProperty && (
        <SearchByProperty
          showSearchByProperty={showSearchByProperty}
          setShowSearchByProperty={setShowSearchByProperty}
        />
      )}
    </>
  );
};

export default BottomFooter;
