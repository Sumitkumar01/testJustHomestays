import {
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { AiOutlineWhatsApp } from "react-icons/ai";
import MModal from "./mobileModal";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

export default function Bottombar() {
  const [loc, setLoc] = useState([]);
  const [mmodal, setMmodal] = useState(false);
  const [value, setValue] = useState([]);
  const [propData, setPropData] = useState([]);

  const options = {
    method: "GET",
    url: process.env.API_URL + "Location",
    params: { limit: "1000", where: "(TotalCount,gt,0)", sort: "-TotalCount" },
    headers: {
      "xc-token": process.env.API_KEY,
    },
  };

  async function fetchData() {
    try {
      let response1 = await fetch(
        `${process.env.API_URL}Property?limit=1000&fields=Title,Slug`,
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      let data1 = await response1.json();
      let response2 = await fetch(
        `${process.env.API_URL}StayVista?limit=1000&fields=Title,Slug`,
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      let data2 = await response2.json();
      let data = [...data1.list, ...data2.list];
      setPropData(data);
    } catch (error) {
      console.error("Fetching data failed", error);
      return null;
    }
  }

  const getData = useCallback(() => {
    axios.request(options).then(function (res) {
      setLoc(res.data.list);
    });
  }, []);

  useEffect(() => {
    if (value.length === 0) {
      const data = loc.map((lc, index) => ({
        id: index + 1,
        town: lc.Town,
        state: lc.State,
      }));
      setValue(data);
    }
  }, [loc]);

  useEffect(() => {
    getData();
    fetchData();
  }, []);

  

  return (
    <>
      <div className="fixed z-30 px-4 py-2 bg-white w-full rounded-md bottom-0 left-0 md:hidden drop-shadow-[0_-5px_10px_rgba(0,0,0,0.25)]">
        <div className="mx-auto">
          <div className="grid grid-cols-4 text-center">
            <div
              className="text-center justify-center cursor-pointer"
              onClick={() => setMmodal(true)}
            >
              <MagnifyingGlassIcon className="h-5 text-black mx-auto" />
              <p className="text-black text-sm font-normal mt-1">Search</p>
            </div>
            <div className="cursor-pointer">
              <a href="/wishlist">
                <HeartIcon className="h-5 text-black mx-auto" />
                <p className="text-black text-sm font-normal mt-1">Wishlist</p>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="/user/Accounts">
                <UserIcon className="h-5 text-black mx-auto" />
                <p className="text-black text-sm font-normal mt-1">Profile</p>
              </a>
            </div>
            <div className="cursor-pointer">
              <a
                href="https://wa.me/919810325245?text=I%20need%20help%20with%20JustHomeStay"
                target="_blank"
              >
                <AiOutlineWhatsApp className="h-5 text-black mx-auto" />
                <p className="text-black text-sm font-normal mt-1">Support</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <a
        href="https://wa.me/919810325245?text=I%20need%20help%20with%20JustHomeStay"
        target="_blank"
      >
        <div className="hidden md:flex fixed bottom-4 right-4 gap-x-4 z-50">
          <p className="bg-white/50 py-2 px-4 m-auto font-bold rounded-xl">
            Chat with Us!
          </p>
          <div className="p-4 bg-primary rounded-full text-white">
            <AiOutlineWhatsApp className="w-8 h-auto" />
          </div>
        </div>
      </a>
      <MModal
        open={mmodal}
        from={setMmodal}
        value={value}
        propdata={propData}
      />
    </>
  );
}
