import React, { useState, useEffect, useMemo } from "react";
import PropertyCard from "./PropertyCard";
import PHCard from "../pages/propCard";
import TABProperty from "../pages/tabProperty";
import { property } from "lodash";
import { SectionWithContainer } from "./SectionComponents";
// import TABPoperty from "./tabProperty";
// import { ArrowRightIcon } from "@heroicons/react/24/outline";
// import Link from "next/link";

const RecommendedProperties = ({setShowLoginPopup}) => {
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
    <SectionWithContainer>
      <div className="flex flex-col gap-6 w-full px-4">
        <h2 className="text-2xl font-semibold text-normal">
          Recommended Properties
        </h2>

        <div className="flex flex-col gap-4">
          {loc.map((town, index) => (
            <div key={`town-${index}`}>
              <TABProperty
                town={town.Town}
                jhs={town.Property}
                sv={town.StayVista}
                setShowLoginPopup={setShowLoginPopup}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWithContainer>
  );
};

export default RecommendedProperties;
