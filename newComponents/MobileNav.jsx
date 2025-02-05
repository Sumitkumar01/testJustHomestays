"use client";
import Image from "next/image";
import Link from "next/link";
import {
  BlogsIcon,
  CollectionsIcon,
  ContactUs,
  DropDown,
  ListYourProperty,
  NextNavigationIcon,
  Policies,
  PopularDestination,
  UserProfileIcon,
} from "../util/icons";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useUserDetails } from "../pages/user/details";
export const navLink = [
  {
    id: 1,
    icon: <PopularDestination />,
    label: "Destinations",
    subLink: [
      {
        id: 1,
        label: "Shimla",
        href: "/shimla",
      },
      {
        id: 2,
        label: "Jibhi",
        href: "/jibhi",
      },
      {
        id: 3,
        label: "Mussoorie",
        href: "/mussoorie",
      },
      {
        id: 4,
        label: "Goa",
        href: "/goa",
      },
      {
        id: 5,
        label: "Kasauli",
        href: "/Kasauli",
      },
      {
        id: 6,
        label: "Lonavala",
        href: "/lonavala",
      },
      {
        id: 7,
        label: "New Delhi",
        href: "/new-delhi",
      },
      {
        id: 8,
        label: "Nasik",
        href: "/nasik",
      },
      {
        id: 9,
        label: "Manali",
        href: "/Manali",
      },
      {
        id: 10,
        label: "Explore all",
        href: "/",
      },
    ],
  },
  {
    id: 2,
    icon: <ListYourProperty />,
    label: "list your property",
    href: "",
  },
  {
    id: 3,
    icon: <ContactUs />,
    label: "Contact Us",
    href: "/contact-us",
  },
  {
    id: 4,
    icon: <CollectionsIcon />,
    label: "Collections",
    subLink: [
      {
        id: 1,
        href: "/pet-friendly-villas",
        label: "Pet Friendly Villas",
      },
      {
        id: 2,
        href: "/top-pool-collection",
        label: "Top Pool Collection",
      },

      {
        id: 3,
        href: "/mussoorie-1-bedroom-homestays",
        label: "Mussoorie 1 Bedroom Homestays",
      },
      {
        id: 4,
        href: "/mountain-calling",
        label: "Mountain Calling",
      },
      {
        id: 5,
        href: "/all_categories",
        label: "Explore all",
      },
    ],
  },
  {
    id: 5,
    icon: <BlogsIcon />,
    label: "Blogs",
    href: "/blogs",
  },
  {
    id: 6,
    icon: <Policies />,
    label: "Policy",
    subLink: [
      {
        id: 1,
        href: "/privacy-policy",
        label: "Privacy Policy",
      },
      {
        id: 2,
        href: "/cancellation-policy",
        label: "Cancellation Policy",
      },

      {
        id: 3,
        href: "/terms-and-conditions",
        label: "Terms & Conditions",
      },
    ],
  },
];

const MobileNav = ({ setopen, setShowLoginPopup }) => {

  const [openDropDown, setOpenDropDown] = useState(null);
  const [cookies] = useCookies(["isLoggedIn", "mobile"]);
  const isLoggedIn = cookies.isLoggedIn;
  // const [user, setUser] = useState("");


  const user = useUserDetails(cookies.mobile);
  console.log(user)

  const handleClick = () => {
    if (isLoggedIn) {
      setopen(false);
    } else {
      setShowLoginPopup(true);
      setopen(false);
    }
  };

  // useEffect(() => {
  //   const user = useUserDetails(cookies.mobile);
  //   setUser(user);
  // }, [])


  return (
    <div className="flex flex-col z-[999] relative gap-4 pt-4 h-full bg-white text-stone-900 w-4/5">
      <div className="grid grid-cols-5 items-center justify-around gap-4 p-2 rounded-2xl bg-primary text-white m-2">
        <div className="col-span-1 relative rounded-full border aspect-square w-full flex justify-center items-center">
          {/* <Image src="/logo.png" alt="logo" className="w-full" fill /> */}
          <UserProfileIcon />
        </div>
        <div className="col-span-3 flex flex-col gap-1">
          <h2 className="font-bold text-lg capitalize">Welcome</h2>
          {!isLoggedIn ? (
            <div className="flex gap-1">
              <button onClick={handleClick} className="text-sm">
                Login
              </button>
              /
              <button onClick={handleClick} className="text-sm">
                Sing Up
              </button>
              now
            </div>
          )
            :
            <h2 className="font-bold text-lg capitalize">{user.Name}</h2>
          }
        </div>
        <div className="col-span-1 flex justify-center items-center w-8 aspect-square">
          <NextNavigationIcon />
        </div>
      </div>
      <div className="w-full h-[1px] bg-stone-200"></div>
      <div className="flex flex-col gap-4 py-8 px-4 text-base">
        {navLink.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            {item.subLink ? (
              <button
                className="flex items-center justify-between gap-4 w-full text-normal text-lg capitalize"
                onClick={() =>
                  setOpenDropDown(openDropDown === item.id ? null : item.id)
                }
              >
                <span className="flex items-center gap-4">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <span
                  className={`${openDropDown === item.id && "rotate-180"
                    } transition-all duration-300 ease-linear ms-auto me-0 w-fit`}
                >
                  <DropDown />
                </span>
              </button>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-4 text-normal text-lg capitalize"
                onClick={() => setopen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
            {openDropDown === item.id && (
              <div
                className={`grid ${item.subLink.length > 6 ? "grid-cols-2" : "grid-cols-1"
                  } w-full gap-3 py-3`}
              >
                {item.subLink?.map((sub) => (
                  <Link
                    href={
                      item.id === 4
                        ? sub.label === "Explore all"
                          ? "/all_categories"
                          : "/category" + sub.href
                        : sub.href
                    }
                    key={sub.id}
                    className={`text-start text-normal text-base ps-2  w-full ${sub.label === "Explore all"
                      ? "font-medium underline underline-offset-auto"
                      : "capitalize"
                      }`}
                    onClick={() => {
                      setopen(false);
                    }}
                  >
                    <span className="w-max whitespace-nowrap">{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
