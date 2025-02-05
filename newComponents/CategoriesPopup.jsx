"use client";
import { CloseButton } from "../util/icons";
import { useEffect, useState } from "react";
import PropertyCard2 from "./PropertyCard2";
import axios from "axios";
import Link from "next/link";
const CategoriesPopup = ({ showCategoriesPopup, setShowCategoriesPopup }) => {
  useEffect(() => {
    if (showCategoriesPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCategoriesPopup]);

  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data } = await axios.get(
          "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Categories?where=(Active,eq,true)",
          {
            headers: {
              "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
            },
          }
        );
        setCategoryData(data.list);
      } catch (error) {
        console.error("Failed to fetch category data", error);
      }
    };
    fetchCategoryData();
  }, [setCategoryData]);

  const sendEvent = (category) => {
    window.gtag("event", "category_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a category",
      category_name: category,
    });
  };

  return (
    <div
      className={`fixed z-20 px-4 py-2 w-full h-full bottom-0 left-0 md:hidden bg-black/50 
           transition-all duration-300 ease-in-out`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowCategoriesPopup(false);
      }}
    >
      <div
        className={`flex flex-col gap-4 bg-white py-4 overflow-hidden  ${
          showCategoriesPopup
            ? "fixed bottom-0 left-0 w-full opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-full"
        }  transition-all duration-300 ease-in-out rounded-tr-xl rounded-tl-xl`}
      >
        <button
          className="w-full flex items-center justify-center border-none bg-transparent"
          onClick={() => setShowCategoriesPopup(false)}
        >
          <CloseButton />
        </button>
        <div className=" border-[#D6D6D6] pb-4 w-full h-full px-4 border-b">
          <h2 className="text-xl text-normal">All Categories</h2>
        </div>
        <div
          className="flex flex-col gap-4 overflow-y-auto h-full px-2 pb-16 overflow-x-hidden overflow-scroll"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {categoryData?.map((item) => (
              <Link
                href={"category/" + item.slug}
                onClick={() => sendEvent(item.Title)}
                className="cursor-pointer"
              >
                <PropertyCard2
                  title={item.Title}
                  image={item.Images[0]?.path || ""}
                  key={item.Id}
                  alt={`${item.Title} | Just Home Stay`}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPopup;
