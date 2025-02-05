"use client";
import React, { useEffect, useState } from "react";
import { CloseButton } from "../util/icons";
import Image from "next/image";
const FilterPopup = ({showFilterPopup, setShowFilterPopup}) => {
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    if (showFilterPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilterPopup]);

  const luxuryEscapesData = [
    {
      id: 1,
      src: "/swimming-pool.png",
      title: "swimming pool",
    },
    {
      id: 2,
      src: "/jacuzzi.png",
      title: "jacuzzi",
    },
    {
      id: 3,
      src: "/pet.png",
      title: "pet friendly",
    },
  ];
  const bedRoomsData = [
    "1 Bhk",
    "2 Bhk",
    "3 Bhk",
    "4 Bhk",
    "5 Bhk",
    "6 Bhk",
    "7 Bhk",
    "8 Bhk",
    "9+ Bhk",
  ];
  const amenitiesData = [
    {
      id: 1,
      title: "popular",
      items: [
        "wifi",
        "air conditioner",
        "TV",
        "kitchen",
        "geyser",
        "hair dryer",
      ],
    },
    {
      id: 2,
      title: "essentials",
      items: ["washing machine", "TV", "iron", "geyser"],
    },
    {
      id: 3,
      title: "features",
      items: ["hot tub", "BBQ grill", "breakfast", "free parking", "kind bed"],
    },
  ];
  return (
    <div
      className={`fixed z-30 px-4 py-2 w-full h-full bottom-0 left-0 md:hidden bg-black/50 
                   transition-all duration-300 ease-in-out`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowFilterPopup(false);
      }}
    >
      <div
        className={`flex flex-col gap-4 bg-white py-4 overflow-hidden fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out rounded-tr-xl rounded-tl-xl ${
          showFilterPopup
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-full"
        }`}
      >
        <button
          className="w-full flex items-center justify-center border-none bg-transparent"
          onClick={() => setShowFilterPopup(false)}
        >
          <CloseButton />
        </button>
        <div className=" border-[#D6D6D6] pb-4 w-full h-full px-4 border-b">
          <h2 className="text-xl text-normal">Filters</h2>
        </div>
        <div
          className="flex flex-col gap-4 overflow-y-auto h-full px-4 pb-20  overflow-x-hidden overflow-scroll"
          style={{ maxHeight: "calc(100vh - 210px)" }}
        >
          <div className="w-full flex flex-col gap-8">
            {/* luxury escapes */}
            <div className="w-full flex flex-col gap-6">
              <h2 className="text-xl text-normal font-semibold">
                Luxury Escapes
              </h2>
              <div className="grid grid-cols-3 items-center justify-center gap-4">
                {luxuryEscapesData.map((item) => (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center w-full aspect-square border rounded-lg">
                      <Image
                        src={item.src}
                        alt={item.title || "type"}
                        width={64}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <span className="capitalize text-sm text-dark">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full bg-zinc-300 min-h-[1px]" />
            {/* price range */}
            <div className="w-full flex flex-col gap-6">
              <h2 className="text-xl text-normal font-semibold">Price Range</h2>
              <div className="w-full">
                <input
                  type="range"
                  min={980}
                  max={50000}
                  className="w-full h-2 bg-normal appearance-none rounded-lg cursor-pointer"
                />
              </div>
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex flex-col items-center gap-2">
                  <span className="text-light">Minimum</span>
                  <span className="px-6 py-2 w-36 text-normal border border-light rounded-lg flex items-center justify-center">
                    ₹980
                  </span>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                  <span className="text-light">Maximum</span>
                  <span className="px-6 py-2 w-36 text-normal border border-light rounded-lg flex items-center justify-center">
                    ₹50,000+
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full bg-zinc-300 min-h-[1px]" />
            {/* Bedrooms */}
            <div className="w-full flex flex-col gap-6">
              <h2 className="text-xl text-normal font-semibold">Bedrooms</h2>
              <div className="w-full grid grid-cols-3 items-center  gap-3">
                {bedRoomsData.map((item) => (
                  <button className="px-4 py-2 text-normal border border-light rounded-lg flex items-center justify-center shadow-inner shadow-white">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full bg-zinc-300 min-h-[1px]" />
            {/* Amenities   */}
            <div className="w-full flex flex-col gap-6">
              <h2 className="text-xl text-normal font-semibold">Amenities</h2>
              <div className="flex flex-col gap-6 w-full">
                {amenitiesData
                  .slice(0, showMore ? amenitiesData.length : 1)
                  .map((amenity) => (
                    <React.Fragment key={amenity.id}>
                      {showMore && (
                        <h3 className="text-normal capitalize text-lg">
                          {amenity.title}
                        </h3>
                      )}
                      <div className="w-full flex flex-wrap  gap-3">
                        {amenity.items.map((amenity) => (
                          <button className="px-4 py-2 text-normal border border-light rounded-lg flex items-center justify-center shadow-inner shadow-white capitalize">
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                <button
                  className="text-lg underline underline-offset-auto font-medium text-dark capitalize text-start"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? " Show Less" : "show More"}
                </button>
              </div>
            </div>

            {/* <div className="flex w-full bg-zinc-300 min-h-[1px]" /> */}
          </div>

          {/* buttons for apply and clear */}
          <div
            className="flex items-center justify-around gap-2 py-3 px-4 fixed bottom-0  left-0 w-full bg-white"
            style={{ boxShadow: "0px 7px 29px 0px rgba(100, 100, 111, 0.20)" }}
          >
            <button
              type="button"
              className=" bg-white border border-white font-medium hover:bg-dark hover:text-white py-2 px-4 rounded-lg w-full capitalize"
              onClick={() => setShowFilterPopup(false)}
            >
              Clear all
            </button>
            <button
              type="submit"
              className="bg-dark text-white border font-medium border-dark hover:bg-white hover:text-dark py-4 px-6 text-base rounded-lg w-full"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
