import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import PropertyCard3 from "./PropertyCard3";
import { NextBtnIcon, OutlineArrow, PrevBtnIcon } from "../util/icons";
import DestinationsPopup from "./DestinationsPopup";
import { SectionWithContainer } from "../newComponents/SectionComponents";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
const PopularDestination = () => {
  const [loc, setLoc] = useState([]);
  const [open, setOpen] = useState(false);
  const [mmodal, setMmodal] = useState(false);
  const [value, setValue] = useState([]);
  const router = useRouter();

  const sendEvent = (town) => {
    window.gtag("event", "location_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a location",
      location_name: town,
    });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/getLocations");
        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.status}`);
        }
        const data = await response.json();
        setLoc(data);

        const mappedData = data.map((lc, index) => ({
          id: index + 1,
          town: lc.Town,
          state: lc.State,
        }));
        setValue(mappedData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleClick = useCallback(
    (town) => {
      sendEvent(town);
      router.push(`/location/${town}`);
    },
    [router]
  );
  return (
    <SectionWithContainer>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between gap-6 w-full">
          <div className="flex flex-col gap-6 w-full">
            <h2 className="text-2xl font-semibold text-normal">
              Popular Destinations
            </h2>
            <p className="text-lg text-light">
              Embark on a Journey to Remember and Create Lasting Memories
            </p>
          </div>
          <button
            className="flex flex-col lg:flex-row w-max whitespace-nowrap border gap-1 shadow-inner shadow-gray-50 items-center justify-center py-4 px-4 rounded-lg border-normal font-medium"
            onClick={() => setOpen(true)}
          >
            Explore all Locations <OutlineArrow />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 lg:hidden">
          {loc.length > 0 && (
            <React.Fragment>
              {loc.slice(0, 11).map((lc, index) => (
                <div key={index} onClick={() => handleClick(lc.Town)}>
                  {/* <LCard
                    image={`https://test.justhomestay.in/${lc.Image[0].path}`}
                    state={lc.State}
                    location={lc.Town}
                    number={Number(lc.CountSV) + Number(lc.CountJHS)}
                    alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                  /> */}
                  <PropertyCard3
                    src={`https://test.justhomestay.in/${lc.Image[0].path}`}
                    alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                    name={lc.Town}
                  />
                </div>
              ))}
            </React.Fragment>
          )}
          <button
            className="flex flex-col border gap-1 shadow-inner shadow-gray-50 items-center justify-center py-2 px-2 rounded-lg border-normal font-medium"
            onClick={() => setOpen(true)}
          >
            <OutlineArrow /> Explore all
          </button>
        </div>
        <div className="lg:block hidden relative">
          <Swiper
            modules={[Navigation, Pagination, Grid]}
            slidesPerView={6}
            spaceBetween={24}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
            }}
            grid={{
              rows: 2,
              fill: "row",
            }}
          >
            {loc?.slice(0, 50).map((lc, index) => (
              <SwiperSlide key={index} onClick={() => handleClick(lc.Town)}>
                <PropertyCard3
                  src={`https://test.justhomestay.in/${lc.Image[0].path}`}
                  alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                  name={lc.Town}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="next absolute top-1/2 -right-14 z-10 transform -translate-y-1/2">
            <NextBtnIcon />
          </button>
          <button className="prev absolute top-1/2 -left-14 z-10 transform -translate-y-1/2">
            <PrevBtnIcon />
          </button>
        </div>
      </div>
      {open && (
        <DestinationsPopup
          showDestinationsPopup={open}
          setShowDestinationsPopup={setOpen}
        />
      )}
    </SectionWithContainer>
  );
};

export default PopularDestination;
