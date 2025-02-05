import React, { useEffect, useState, useRef } from "react";
import LCard from "./locationCard";
import { useRouter } from "next/router";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { BsXLg } from "react-icons/bs";

export default function AILocations({ open, from, data }) {
  const [loc, setLoc] = useState([]);
  const [param, setParam] = useState("");
  const router = useRouter();


  const getData = async () => {
    try {
      // const res = await axios.get(`${process.env.API_URL}/Location`, {
      const res = await axios.get(`https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Location`, {
        headers: {
          // "xc-token": process.env.API_KEY,
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
        params: {
          limit: "100",
          where: "(TotalCount,gt,0)",
          sort: "-TotalCount",
          fields: "Image,Town,State,CountSV,CountJHS",
        },
      });
      setLoc(res.data.list);
    }
    catch (error) {
      console.log("Error getting data " + error.message)
    }

  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      handleCancel();
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleCancel = () => {
    from(false);
  };

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

  if (open) {
    return (
      <div className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div
          {...handlers}
          className="modal-box max-w-screen-xl p-2 md:p-4 text-right w-screen md:w-full md:rounded-xl absolute h-4/5 md:h-2/3 bottom-0 md:bottom-auto max-h-screen transform-none rounded-none"
        >
          <div className="p-1 w-full justify-center mx-auto block md:hidden pb-2">
            <div className="h-2 w-36 bg-neutral rounded-full mx-auto"></div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
              onClick={() => {
                setParam("");
                from(false);
              }}
            >
              <BsXLg className="h-6 w-6" />
            </button>
          </div>
          <p className="font-bold text-center text-lg">All destinations</p>
          <div className="md:w-max w-full text-center px-2 my-4 grid grid-cols-6 gap-x-2 mx-auto">
            <input
              placeholder={"Search here..."}
              value={param}
              type="text"
              className="input col-span-6 grid md:col-span-5 md:max-w-sm w-full text-center outline outline-slate-100"
              onChange={(e) => setParam(e.target.value)}
            />
            <button
              onClick={() => setParam("")}
              className="btn btn-primary md:grid col-span-1 hidden"
            >
              Clear
            </button>
          </div>
          <div className=" grid md:grid-cols-6 grid-cols-2 gap-y-2 mt-4 overflow-y-auto">
            {loc
              .filter(
                (lc) =>
                  lc.Town.toLowerCase().includes(param) ||
                  lc.State.toLowerCase().includes(param)
              )
              .map((lc, index) => (
                <div key={lc.UID || index} className="grid col-span-1">
                  <a
                    onClick={() => sendEvent(lc.Town)}
                    className="cursor-pointer"
                    href={"/location/" + lc.Town}
                  >
                    <LCard
                      image={"https://test.justhomestay.in/" + lc.Image[0].path}
                      state={lc.State}
                      location={lc.Town}
                      number={Number(lc.CountSV) + Number(lc.CountJHS)}
                      alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                    />
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}
