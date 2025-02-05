"use client";
import { CloseButton, SearchIcon1 } from "../util/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import PropertyCard3 from "./PropertyCard3";
const DestinationsPopup = ({
  showDestinationsPopup,
  setShowDestinationsPopup,
}) => {
  useEffect(() => {
    if (showDestinationsPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDestinationsPopup]);
  const [loc, setLoc] = useState([]);
  const [param, setParam] = useState("");
  const router = useRouter();

  const getData = async () => {
    const res = await axios.get(process.env.API_URL + "Location", {
      headers: {
        "xc-token": process.env.API_KEY,
      },
      params: {
        limit: "100",
        where: "(TotalCount,gt,0)",
        sort: "-TotalCount",
        fields: "Image,Town,State,CountSV,CountJHS",
      },
    });
    setLoc(res.data.list);
  };

  // const handlers = useSwipeable({
  //   onSwipedDown: () => {
  //     handleCancel();
  //   },
  //   swipeDuration: 500,
  //   preventScrollOnSwipe: true,
  //   trackMouse: true,
  // });

  // const handleCancel = () => {
  //   from(false);
  // };

  const sendEvent = (town) => {
    window.gtag("event", "location_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a location",
      location_name: town,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      className={`fixed z-30 px-4 py-2 w-full h-full bottom-0 left-0 md:hidden bg-black/50 
      transition-all duration-300 ease-in-out`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowDestinationsPopup(false);
      }}
    >
      <div
        className={`flex flex-col gap-4 bg-white py-4 overflow-hidden fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out rounded-tr-xl rounded-tl-xl ${showDestinationsPopup
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-full"
          }`}
      >
        <button
          className="w-full flex items-center justify-center border-none bg-transparent"
          onClick={() => setShowDestinationsPopup(false)}
        >
          <CloseButton />
        </button>
        <div className=" border-light border-b pb-4 w-full h-full px-4">
          <h2 className="text-xl">All Destinations</h2>
        </div>
        <div
          className="flex flex-col gap-4 overflow-y-auto h-full px-4 pb-[5rem] overflow-x-hidden overflow-scroll"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          <div className="border-light rounded-full gap-2 border py-4 px-6 w-full flex items-center">
            <span className="">
              <SearchIcon1 />
            </span>
            <input
              className="w-full bg-transparent border-none outline-none"
              placeholder="Search any destination..."
              value={param}
              onChange={(e) => setParam(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {loc
              .filter(
                (lc) =>
                  lc.Town.toLowerCase().includes(param) ||
                  lc.State.toLowerCase().includes(param)
              )
              .map((lc) => (
                <div key={lc.UID} className="">
                  <Link
                    onClick={() => sendEvent(lc.Town)}
                    className="cursor-pointer"
                    href={"/location/" + lc.Town}
                  >
                    {/* <PropertyCard2
                      image={"https://test.justhomestay.in/" + lc.Image[0].path}
                      // state={lc.State}
                      // location={lc.Town}
                      // number={Number(lc.CountSV) + Number(lc.CountJHS)}
                      alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                    /> */}
                    <PropertyCard3
                      src={"https://test.justhomestay.in/" + lc.Image[0].path}
                      name={lc.Town}
                      alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                    />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsPopup;
