import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <div
        onClick={scrollToTop}
        className="flex fixed  md:bottom-8 group bottom-20 md:left-8 right-8 z-50 w-max animate-bounce"
      >
        <div className="opacity-50 bg-black rounded-full p-4 hover:opacity-70 cursor-pointer">
          <FaArrowUp className="w-4 h-4 text-white" />
        </div>
        <p className="my-auto bg-white group-hover:w-auto group-hover:h-auto group-hover:opacity-100 opacity-0 w-0 h-0 transition-all duration-300 ease-in-out p-2 rounded-md overflow-hidden">
          Back to Top
        </p>
      </div>
    )
  );
}
