import React, { useState, useEffect, useMemo } from "react";
import TABPoperty from "./tabProperty";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TLocation({setShowLoginPopup}) {
  const [loc, setLoc] = useState([]);
  const [openTab, setOpenTab] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getFeaturedLocations");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setLoc(data);
      } catch (error) {
        console.error("Error fetching featured locations:", error);
      }
    };

    fetchData();
  }, []);

  // Memoized locations to avoid unnecessary re-renders
  const locations = useMemo(() => loc || [], [loc]);

  if (!locations.length) {
    return <p className="text-center text-gray-500">No locations available.</p>;
  }


  return (
    <div>
      <div className="flex flex-col items-left justify-left md:max-w-[1140px] max-w-screen-sm overflow-x-hidden mt-6">
        {/* Tabs */}
        <ul className="flex md:space-x-4 space-x-2 overflow-y-auto px-4">
          {locations.map((lc, index) => (
            <li key={index} className="w-max">
              <button
                onClick={() => setOpenTab(index)}
                className={`inline-block w-28 md:w-max md:px-6 px-3 py-1 text-center md:text-left rounded-2xl cursor-pointer text-neutral ${openTab === index ? "bg-[#E8BF29]" : "bg-[#e3e8e3]"
                  }`}
              >
                {lc.Town}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Content */}
        <div className="p-3 mt-4 bg-white">
          {locations[openTab] && (
            <div>
              <TABPoperty
                town={locations[openTab].Town}
                jhs={locations[openTab].Property}
                sv={locations[openTab].StayVista}
                setShowLoginPopup={setShowLoginPopup}
              />
              <Link href={`/location/${locations[openTab].Town}`} passHref>
                <div className="mx-auto w-max mt-8 cursor-pointer">
                  <div className="grid grid-cols-5 px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary">
                    <div className="grid col-span-4">
                      <p className="text-base">
                        More in {locations[openTab].Town}
                      </p>
                    </div>
                    <div className="grid col-span-1 items-center">
                      <ArrowRightIcon className="w-5 grid col-span-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
