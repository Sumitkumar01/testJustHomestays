import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import LCard from "./locationCard";
import React, { useState, useEffect } from "react";
import ALocations from "./allLocations";
import DatePicker from "react-datepicker";
import Stepper from "./numStepper";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useRouter } from "next/router";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [loc, setLoc] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [value, setValue] = useState([]);
  const [rand, setRand] = useState([]);
  const [town, setTown] = useState("");
  const router = useRouter();

  const dateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  };

  const reset = () => {
    setStartDate(null);
    setendDate(null);
  };

  const updateLoc = (message) => {
    // console.log(message);
    setLocation(message);
  };

  var myHeaders = new Headers();

  myHeaders.append("Authorization", "Bearer keyqr8i1QluuOLwTR");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const getData = () => {
    fetch(
      "https://api.airtable.com/v0/appmb6iDjAZASSrda/Location?view=Grid%20view",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((myJson) => {
        setLoc(myJson.records);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
    const setArray = () => {
      var data = loc.map((lc, index) => ({
        ...data,
        id: index + 1,
        town: lc.fields.Town,
        state: lc.fields.State,
      }));
      setValue(data);
    };
    if (value.length == 0) {
      setArray();
    }
    if (rand.length == 0) {
      setRand(loc.sort(() => Math.random() - 0.5));
    }
  }, [loc]);

  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    setLocation(item.town + ", " + item.state);
    setTown(item.town);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    setLocation("");
  };

  return (
    <div className="mx-auto md:mt-32 mt-20 w-[90%] md:h-24 h-12 p-2 rounded-full bg-base-100 flex flex-row text-primary mb-2">
      <div className="pt-1 pl-4 md:hidden">
        <MagnifyingGlassIcon className="w-6 inline-block" />
        <p className="inline-block ml-2 font-medium">Search for Destination</p>
      </div>
      <div className="md:grid flex-grow p-4 text-primary text-center hidden">
        <div className="dropdown">
          <div tabIndex={0} className="cursor-pointer">
            <p className="text-lg">Destination</p>
            {location ? (
              <p className="text-secondary font-bold">{location}</p>
            ) : (
              <p>Where are you going?</p>
            )}
          </div>
          <div
            tabIndex={0}
            className="dropdown-content mt-6 card card-compact w-[36rem] p-1 shadow bg-base-100 text-neutral"
          >
            <div className="card-body text-center items-center">
              <h3 className="card-title">Find your perfect destination!</h3>
              <div className="w-full max-w-xs">
                <ReactSearchAutocomplete
                  items={value}
                  fuseOptions={{ keys: ["town", "state"] }}
                  resultStringKeyName="town"
                  onSearch={handleOnSearch}
                  onHover={handleOnHover}
                  onSelect={handleOnSelect}
                  onFocus={handleOnFocus}
                  onClear={handleOnClear}
                  styling={{ zIndex: 4 }} // To display it on top of the search box below
                  autoFocus
                />
              </div>
              <p className="font-bold text-base mt-4">All destinations</p>
              <div className="grid grid-cols-3 gap-y-2 mt-2">
                {rand.slice(0, 3).map((lc) => (
                  <div
                    key={lc.fields.UID}
                    className="grid col-span-1"
                    onClick={() => {
                      updateLoc(lc.fields.Town + ", " + lc.fields.State);
                      setTown(lc.fields.Town)
                    }}
                  >
                    <LCard
                      image={"https://jhsstorage.biz/images/" + lc.fields.Image}
                      state={lc.fields.State}
                      location={lc.fields.Town}
                      number={lc.fields.TotalCount}
                    />
                  </div>
                ))}
              </div>
              <a
                className="cursor-pointer"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <div className="grid grid-cols-5 px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary">
                  <div className="grid col-span-4">
                    <p className="text-base">Explore More</p>
                  </div>
                  <div className="grid col-span-1 items-center">
                    <ArrowRightIcon className="w-5 grid col-span-1" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="divider divider-horizontal border-neutral md:block hidden"></div>
      <div className="dropdown md:block hidden">
        <div tabIndex={1} className="cursor-pointer">
          <div className="grid grid-cols-2 flex-grow p-4 px-8 gap-8 text-primary text-center">
            <div className="grid col-span-1">
              <p className="text-lg">Check-in</p>
              {startDate ? (
                <p className="text-secondary font-bold">
                  {startDate.toLocaleDateString()}
                </p>
              ) : (
                <p>The first day!</p>
              )}
            </div>
            <div className="grid col-span-1">
              <p className="text-lg">Check-out</p>
              {endDate ? (
                <p className="text-secondary font-bold">
                  {endDate.toLocaleDateString()}
                </p>
              ) : (
                <p>The last day!</p>
              )}
            </div>
          </div>
        </div>
        <div
          tabIndex={1}
          className="dropdown-content mt-2 card card-compact w-max p-1 shadow bg-base-100 text-neutral"
        >
          <div className="card-body text-center items-center">
            <p className="pb-4 text-base font-bold">
              Select Check-in & Check-out dates
            </p>
            <DatePicker
              onChange={dateChange}
              startDate={startDate}
              endDate={endDate}
              selected={startDate}
              selectsRange
              inline
            />
            <a
              onClick={() => reset()}
              className="text-primary underline cursor-pointer text-base"
            >
              Haven't decided dates yet?
            </a>
          </div>
        </div>
      </div>
      <div className="divider divider-horizontal border-neutral md:block hidden"></div>
      <div className="dropdown md:block hidden">
        <div tabIndex={2} className="cursor-pointer">
          <div className="grid flex-grow min-w-[14rem] p-4 text-primary text-center">
            <p className="text-lg">Guests</p>
            {adult ? (
              <p className="font-bold text-secondary">
                {adult} Adults
                {children ? <span>, {children} Children</span> : ""}
              </p>
            ) : (
              <p>Who all are coming along?</p>
            )}
          </div>
        </div>
        <div
          tabIndex={2}
          className="dropdown-content mt-2 card card-compact w-[30rem] p-1 shadow bg-base-100 text-neutral"
        >
          <div className="card-body text-left p-4 items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid col-span-2">
                <p className="text-lg font-bold">Adults</p>
                <p>Age 12 years & above</p>
              </div>
              <div className="grid col-span-1">
                <Stepper name="adult" reverse={setAdult} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid col-span-2">
                <p className="text-lg font-bold">Children</p>
                <p>Between ages 5-12 years</p>
              </div>
              <div className="grid col-span-1">
                <Stepper name="child" reverse={setChildren} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider-horizontal md:block hidden"></div>
      <div
        onClick={() =>
          router.push(
            "/location/" +
              town +
              "?startDate=" +
              encodeURIComponent(startDate) +
              "&endDate=" +
              encodeURIComponent(endDate) +
              "&adult=" +
              adult +
              "&child=" +
              children
          )
        }
        className="md:grid w-20 bg-primary justify-center items-center h-full py-auto rounded-full hidden cursor-pointer"
      >
        <MagnifyingGlassIcon className="w-8 text-base-100" />
      </div>
      <ALocations open={open} from={setOpen} newLoc={setLocation} newTown={setTown} />
    </div>
  );
}
