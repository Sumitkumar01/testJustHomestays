// NearbyProperties.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import PHCard from "../propCard";
import Header from "../header";
import Footer from "../Footer.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import RangeSlider from "react-range-slider-input/dist/components/RangeSlider";
import _ from "lodash";
import { ColorRing } from "react-loader-spinner";

function NearbyProperties() {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(100); // Default distance
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [visibleCards, setVisibleCards] = useState(3);
  const [userCity, setUserCity] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://ipgeolocation.abstractapi.com/v1/?api_key=c5256b0108644cb39bb3288ef79db8be"
      )
      .then((response) => {
        setLocation({
          latitude: response.data.latitude,
          longitude: response.data.longitude
        });
        setUserCity(response.data.city + ", " + response.data.region);
      })
      .catch((error) => {
        console.log("Error fetching the user location:", error);
      });
  }, []);

  useEffect(() => {
    if (location) {
      updateList(location.latitude, location.longitude, distance);
    }
  }, [location]);

  const updateList = async (lat, long, dis) => {
    await fetch(`/api/nearbyProperties?lat=${lat}&lng=${long}&dist=${dis}`)
      .then((response) => response.json())
      .then((data) => {
        // Convert 'Cost Per Night' to number and sort the data by 'Cost Per Night' using Lodash
        const sortedData = _.sortBy(data, (prop) =>
          Number(prop["Cost per Night"])
        );
        setNearbyProperties(sortedData);
      })
      .catch((err) => console.error(err));
  };

  const triggerUpdate = () => {
    setNearbyProperties(null);
    if (location) {
      setTimeout(() => {
        updateList(location.latitude, location.longitude, distance);
      }, 500);
    }
    setVisibleCards(3);
  };

  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full md:px-0 px-4">
        <Header />
        <div className="my-4 bg-white drop-shadow-xl p-4 rounded-xl">
          <div className="md:grid md:grid-cols-8">
            <div className="md:grid md:col-span-2 my-auto text-center md:text-left">
              <p>Looks like you are in:</p>
              <p className="text-primary font-bold text-lg">{userCity}</p>
            </div>
            <div className="md:grid md:col-span-6">
              <div className="md:grid md:grid-cols-6 gap-8">
                <div className="md:grid md:col-span-4 w-full mt-4">
                  <RangeSlider
                    min={25}
                    max={600}
                    step={25}
                    defaultValue={[25, distance]}
                    onInput={(e) => setDistance(e[1])}
                  />
                  <div className="flex justify-between">
                    <p className="text-left mt-4">25 Kms</p>
                    <label className="mt-4 text-center">
                      Distance: {distance} Kms
                    </label>
                    <p className="text-right mt-4">600 Kms</p>
                  </div>
                </div>
                <div className="md:grid md:col-span-1 my-auto w-full">
                  <button
                    className="bg-primary text-white rounded-xl drop-shadow-xl md:py-4 py-2 px-6 md:w-max w-full h-max mt-2 md:mt-0 hover:drop-shadow-xl"
                    onClick={() => triggerUpdate()}
                  >
                    Search Nearby
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {nearbyProperties ? (
          <InfiniteScroll
            dataLength={visibleCards}
            next={() =>
              setVisibleCards((prevVisibleCards) => prevVisibleCards + 3)
            }
            hasMore={visibleCards < nearbyProperties.length}
            loader={
              <div className="w-full mx-auto text-center iconcen">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#0C5110",
                    "#E8BF29",
                    "#FCF8E9",
                    "#E8BF29",
                    "#0C5110"
                  ]}
                />
              </div>
            }
            scrollThreshold={0.8}
          >
            <div className="grid md:grid-cols-3 grid-cols-1 gap-x-2 gap-y-4 my-4">
              {nearbyProperties.slice(0, visibleCards).map((prop, index) => {
                return (
                  <div
                    className="grid col-span-1"
                    key={`${prop["PID"]}-${index}`}
                  >
                    <PHCard key={index} property={prop} type={prop.Type} />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="w-full mx-auto text-center iconcen">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#0C5110", "#E8BF29", "#FCF8E9", "#E8BF29", "#0C5110"]}
            />
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default NearbyProperties;
