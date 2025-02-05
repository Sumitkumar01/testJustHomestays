"use client";
import { useEffect, useState } from "react";
import { CloseButton } from "../util/icons";

const SortByPopup = ({
  showSortByPopup,
  setShowSortByPopup,
  setSortOption,
}) => {
  useEffect(() => {
    if (showSortByPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSortByPopup]);

  const formData = [
    {
      type: "checkbox",
      label: "Price: Low to High",
      option:"cost-low-high",
      value: "priceLowToHigh",
      checked: false,
    },
    {
      type: "checkbox",
      label: "Price: High to Low",
      option:"cost-high-low",
      value: "priceHighToLow",
      checked: false,
    },
    {
      type: "checkbox",
      label: "popularity",
      value: "ratingLowToHigh",
      option:"rating-low-high",
      checked: false,
    },
    {
      type: "checkbox",
      label: "Newest first",
      value: "newestFirst",
      option:"newest-first",
      checked: false,
    },
  ];


  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOptions = formData
      .filter((item) => item.checked)
      .map((item) => item.option);
    setSortOption(selectedOptions);
    console.log(selectedOptions);
    setShowSortByPopup(false);
  };
  return (
    <div
      className={`fixed z-30 px-4 py-2 w-full h-full bottom-0 left-0 md:hidden bg-black/50 
           transition-all duration-300 ease-in-out`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowSortByPopup(false);
      }}
    >
      <div
        className={`flex flex-col gap-4 bg-white py-4 overflow-hidden fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out rounded-tr-xl rounded-tl-xl ${
          showSortByPopup
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-full"
        }`}
      >
        <button
          className="w-full flex items-center justify-center border-none bg-transparent"
          onClick={() => setShowSortByPopup(false)}
        >
          <CloseButton />
        </button>
        <div className=" border-[#D6D6D6] pb-4 w-full h-full px-4 border-b">
          <h2 className="text-xl text-normal font-semibold">Sort By</h2>
        </div>
        <form
          className="flex flex-col gap-4 overflow-y-auto h-full px-4  overflow-x-hidden overflow-scroll"
          style={{ maxHeight: "calc(100vh - 250px)" }}
          onSubmit={handleSubmit}
        >
          {formData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type={item.type}
                id={item.value}
                className="w-4 h-4 !text-white"
                checked={item.checked}
                onChange={(e) => {
                  item.checked = e.target.checked;
                }}
                style={{ accentColor: "#fff !important" }} // Change the color of the checkbox
              />
              <label
                htmlFor={item.value}
                className="capitalize text-lg text-normal"
              >
                {item.label}
              </label>
            </div>
          ))}
          <div className="flex items-center justify-around gap-2">
            <button
              type="button"
              className=" bg-white border border-white font-medium hover:bg-dark hover:text-white py-2 px-4 rounded-lg w-full"
              onClick={() => setShowSortByPopup(false)}
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-dark text-white border font-medium border-dark hover:bg-white hover:text-dark py-4 px-6 text-base rounded-lg w-full"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SortByPopup;
