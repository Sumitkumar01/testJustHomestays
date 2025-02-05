import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import LCard from "./locationCard";
import AILocations from "./allLocationsIndex";
import { useRouter } from "next/router";
import MModal from "./mobileModal";

export default function DCarousel() {
  const [loc, setLoc] = useState([]);
  const [open, setOpen] = useState(false);
  const [mmodal, setMmodal] = useState(false);
  const [value, setValue] = useState([]);
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 3,
    autoplay: false,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    lazyLoad: true,
    swipeToSlide: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
          swipeToSlide: true,
          autoplay: true,
          infinite: true,
          initialSlide: 0,
        },
      },
    ],
  };

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
    <div className="mt-8 pl-4 md:pr-4">
      {loc.length > 0 && (
        <Slider {...settings}>
          {loc.slice(0, 19).map((lc, index) => (
            <div key={index} onClick={() => handleClick(lc.Town)}>
              <LCard
                image={`https://test.justhomestay.in/${lc.Image[0].path}`}
                state={lc.State}
                location={lc.Town}
                number={Number(lc.CountSV) + Number(lc.CountJHS)}
                alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
              />
            </div>
          ))}
        </Slider>
      )}
      <div className="mx-auto w-max mt-8" onClick={() => setOpen(true)}>
        <div className="flex px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary cursor-pointer">
          <p className="text-base">Explore all Locations</p>
        </div>
      </div>
      <AILocations open={open} from={setOpen} data={loc} />
      <MModal open={mmodal} from={setMmodal} value={value} />
    </div>
  );
}
