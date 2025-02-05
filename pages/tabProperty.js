import React, { useMemo } from "react";
import PHCard from "./propCard";
import PropertyCard from "../newComponents/PropertyCard";

export default function TABProperty({ town, jhs = [], sv = [],setShowLoginPopup }) {
  // console.log(town, jhs, sv)
  // Combine arrays and shuffle once
  const shuffledProperties = useMemo(() => {
    const combined = [...(jhs || []), ...(sv || [])].filter((item) => item.PID);
    return combined.sort(() => Math.random() - 0.5);
  }, [jhs, sv]);

  // Select properties for desktop and mobile/tablet views
  const desktopProperties = useMemo(
    () => shuffledProperties.slice(0, 1),
    [shuffledProperties]
  );
  const tabletProperties = useMemo(
    () => shuffledProperties.slice(0, 1),
    [shuffledProperties]
  );

  return (
    <div>
      {/* Desktop View */}
      <div className="grid lg:grid md:hidden lg:grid-cols-3 grid-cols-1 gap-x-2 gap-y-4">
        {desktopProperties.map((property, index) => (
          <div className="grid col-span-1" key={index}>
            {/* <PHCard type={property.Type} property={property} setShowLoginPopup={setShowLoginPopup} /> */}
            <PropertyCard property={property} type={property.Type} setShowLoginPopup={setShowLoginPopup} />
          </div>
        ))}
      </div>

      {/* Tablet View */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-x-2 gap-y-4">
        {tabletProperties.map((property, index) => (
          <div className="grid col-span-1 mb-4" key={index}>
            {/* <PHCard type={property.Type} property={property} /> */}
            <PropertyCard property={property} type={property.Type} setShowLoginPopup={setShowLoginPopup}/>
          </div>
        ))}
      </div>
    </div>
  );
}
