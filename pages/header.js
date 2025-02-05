import Image from "next/image";
import { BsPhone } from "react-icons/bs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import logo from "../public/logo_main.webp";
import Link from "next/link";
import { BackIcon, CallIcon, MenuIcon } from "../util/icons.jsx";
import MobileNav from "../newComponents/MobileNav.jsx";
import LoginPopup from "../newComponents/LoginPopup.jsx";

const LOGO_WIDTH = 500;
const LOGO_HEIGHT = 200;

export default function Header() {
  const router = useRouter();
  const [isHomePage, setIsHomePage] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    setIsHomePage(router.pathname === "/");
  }, [router.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div
      className="md:bg-base-100 bg-transparent py-4  w-full z-40 max-md:shadow-lg max-width"
      onClick={handleClickOutside}
    >
      <div className="navbar md:justify-center items-center justify-end">
        {!isHomePage ? (
          <div className="md:hidden bg-transparent">
            <Link href={"/"}>
              <button className="justify-center mt-2 items-center aspect-square bg-white text-black  rounded-md">
                <BackIcon />
              </button>
            </Link>
          </div>
        ) : (
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </button>
        )}
        <div className="md:navbar-start bg-transparent w-full justify-center">
          <Link href="/">
            <Image
              src={logo}
              priority
              className="md:w-52 w-44"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              alt="JustHomeStay Logo"
            />
          </Link>
        </div>
        <Link href="tel:+919810325245" className="md:hidden text-[#393939]">
          <span className="sr-only">call button</span>
          <CallIcon />
        </Link>
        <div className="navbar-end md:flex hidden text-end gap-4 text-neutral">
          <Link href="tel:+919810325245" className="flex gap-2">
            <BsPhone className="w-6 h-6 my-auto" />
            <span className="hover:underline hover:underline-offset-4 transition duration-150">
              +91 98103 25245
            </span>
          </Link>
          {isHomePage && (
            <Link
              className="bg-base-100 outline outline-info text-neutral hover:bg-primary hover:outline-primary hover:text-white transition duration-150 px-8 py-3 cursor-pointer rounded-md"
              href="/partner-with-us"
            >
              List Your Home
            </Link>
          )}
        </div>
      </div>
      <div
        className={`md:hidden absolute bg-black/50 top-0 z-[999] left-0 h-screen w-full ${
          open ? "translate-x-0 scale-x-100" : "-translate-x-full scale-x-0"
        } transition-all duration-300 ease-linear`}
        // onClick={handleClickOutside}
        onTouchMove={() => setOpen(false)}
        draggable={true}
      >
        <MobileNav setopen={setOpen} setShowLoginPopup={setShowLoginPopup} />
      </div>
      {showLoginPopup && (
        <LoginPopup
          showLoginPopup={showLoginPopup}
          setShowLoginPopup={setShowLoginPopup}
        />
      )}
    </div>
  );
}
