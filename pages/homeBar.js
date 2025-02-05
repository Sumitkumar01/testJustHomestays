import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import Stepper from "./numStepper";
import { useRouter } from "next/router";
import MModal from "./mobileModal";
import { add } from "date-fns";
import axios from "axios";
import Image from "next/image";

export default function Search() {
  const [location, setLocation] = useState("");
  const [loc, setLoc] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [value, setValue] = useState([]);
  const [rand, setRand] = useState([]);
  const [town, setTown] = useState("");
  const [mmodal, setMmodal] = useState(false);
  const router = useRouter();
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [propData, setPropData] = useState([]);
  const [filterPropData, setFilterPropData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showGuests, setshowGuests] = useState(false);
  const [inputType, setInputType] = useState("");
  const [propTitle, setPropTitle] = useState("");
  const [propSlug, setPropSlug] = useState("");

  const refone = useRef(null);
  const reftwo = useRef(null);
  const refthree = useRef(null);

  const dateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
    if (start && end) {
      setCheckinOpen(false);
      setshowGuests(true);
    }
  };

  const reset = () => {
    setStartDate(null);
    setendDate(null);
    setCheckinOpen(false);
    setshowGuests(true);
  };

  async function fetchAllStayVistaRecords() {
    const allRecords = [];
    let currentPage = 1;
    const pageSize = 1000; // This matches the limit used in your query

    try {
      while (true) {
        const response = await fetch(
          `${process.env.API_URL
          }StayVista/views/listingStatus?limit=${pageSize}&offset=${(currentPage - 1) * pageSize
          }&fields=Title,Slug`,
          {
            headers: {
              "xc-token": process.env.API_KEY,
            },
          }
        );

        const data = await response.json();
        // Add the current page of records to allRecords
        allRecords.push(...data.list);

        // Check if we've reached the last page
        if (data.pageInfo.totalRows < currentPage * pageSize) {
          break;
        }

        // Move to the next page
        currentPage++;
      }
    } catch (error) {
      console.error("Fetching StayVista records failed", error);
    }

    return allRecords;
  }

  async function fetchData() {
    try {
      const response1 = await fetch(
        `${process.env.API_URL}Property/views/listingStatus?limit=1000&fields=Title,Slug`,
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      const data1 = await response1.json();

      const stayVistaRecords = await fetchAllStayVistaRecords();

      const data = [...data1.list, ...stayVistaRecords];
      setPropData(data);
    } catch (error) {
      console.error("Fetching data failed", error);
    }
  }

  const options = {
    method: "GET",
    url: process.env.API_URL + "Location",
    params: { limit: "1000", sort: "-TotalCount" },
    headers: {
      "xc-token": process.env.API_KEY,
    },
  };

  const getData = async () => {
    const tick = await axios.request(options);
    setLoc(tick.data.list);
    setArray(tick.data.list);
    if (rand.length == 0) {
      setRand(loc.sort(() => Math.random() - 0.5));
    }
  };

  useEffect(() => {
    getData();
    fetchData();
  }, []);

  const setArray = (tick) => {
    var data = tick.map((lc, index) => ({
      ...data,
      id: index + 1,
      town: lc.Town,
      state: lc.State,
      image: lc.Image[0].path,
    }));
    setValue(data);
  };

  useEffect(() => {
    if (search === "") {
      setFilteredData([]);
      setFilterPropData([]);
    } else if (search.length > 0) {
      const newFilteredData = value.filter(
        (item) =>
          item.town.toLowerCase().includes(search.toLowerCase()) ||
          item.state.toLowerCase().includes(search.toLowerCase())
      );
      const newFilterProp = propData.filter((item) =>
        item.Title.toLowerCase().includes(search.toLowerCase())
      );
      setFilterPropData(newFilterProp);
      setFilteredData(newFilteredData);
    }
  }, [search, value]);

  const handleSelectItem = (item, type) => {
    setInputType(type);
    setLocation(item.town + ", " + item.state);
    setSearch(item.town + ", " + item.state);
    setTown(item.town);
    setCheckinOpen(true); // open check-in dropdown
    setShowDropdown(false);
  };

  const handleSelectProp = (item, type) => {
    setPropSlug(item.Slug);
    setPropTitle(item.Title);
    setInputType(type);
    setCheckinOpen(true); // open check-in dropdown
    setShowDropdown(false);
  };

  const handleAlertert = (msg) => {
    alert(msg);
  };

  useEffect(() => {
    let handler = (e) => {
      if (!refone.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (!reftwo.current.contains(e.target)) {
        setCheckinOpen(false);
      }
      if (!refthree.current.contains(e.target)) {
        setshowGuests(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="mx-auto w-[90%] md:h-24 bg-transparent md:bg-white h-12 md:py-2 rounded-lg bg-base-100 flex justify-between">
      <div className="w-full md:hidden">
        <div className="flex item-center  md:border-2 rounded-lg md:shadow-sm bg-white">
          <div className="flex px-1 justify-center items-center">
            <MagnifyingGlassIcon className=" h-10 rounded-full p-2 cursor-pointer text-gray-400" />
          </div>

          <div
            onClick={() => setMmodal(true)}
            className="flex item-center py-2  md:border-2 rounded-full md:shadow-sm"
          >
            <p className="md:pl-5 bg-transparent outline-none flex-grow text-gray-400 placeholder-gray-400 text-lg">
              Search destination
            </p>
          </div>
        </div>
      </div>
      <div className="md:grid p-4 text-center hidden" ref={refone}>
        <p onClick={() => setShowDropdown(!showDropdown)} className="text-lg">
          Destination
        </p>

        <input
          value={inputType !== "property" ? search : propTitle}
          onClick={() => setShowDropdown(true)}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Where are you going?"
          autoFocus
          className={`text-center bg-transparent placeholder:text-neutral focus:outline-none focus:placeholder:text-slate-500 ${search.length > 0 ? "font-bold text-primary" : ""
            }`}
        />
        {showDropdown ? (
          <div className="absolute dropdown dropdown-end bg-white p-2 mt-[76px] -ml-[14px] rounded-lg z-40 w-80 ">
            {filteredData.length === 0 && filterPropData.length === 0 && (
              <div className="mb-2">
                <p className="font-bold">Top Destinations</p>
              </div>
            )}
            {filteredData.length !== 0 && (
              <div className="mb-2">
                <p className="font-bold">Destinations</p>
                {filteredData &&
                  filteredData.slice(0, 6).map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectItem(item, "location")}
                      className="dropdown-item py-2 hover:bg-slate-300 rounded cursor-pointer"
                    >
                      {item.town}, {item.state}
                    </div>
                  ))}
              </div>
            )}
            {filterPropData.length !== 0 ? (
              <div>
                <p className="font-bold">Property</p>
                {filterPropData &&
                  filterPropData.slice(0, 6).map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectProp(item, "property")}
                      className="dropdown-item py-2 hover:bg-slate-300 rounded cursor-pointer"
                    >
                      {item.Title}
                    </div>
                  ))}
              </div>
            ) : (
              ""
            )}
            {filterPropData.length !== 0 || filteredData.length !== 0 ? (
              <div
                className="cursor-pointer font-bold text-primary"
                onClick={() => {
                  setSearch("");
                  setInputType("");
                  setLocation("");
                }}
              >
                Reset
              </div>
            ) : null}

            <div className="grid grid-cols-3 gap-2">
              {filteredData.length === 0 &&
                filterPropData.length === 0 &&
                value.slice(0, 6).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectItem(item, "location")}
                    className="dropdown-item p-2 hover:bg-slate-300 rounded cursor-pointer"
                  >
                    <Image
                      src={"https://test.justhomestay.in/" + item.image}
                      width={300}
                      height={400}
                      className="rounded-lg"
                      alt={item.Town || "Just home stay"}
                    />
                    <p className="pt-2">{item.town}</p>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="hidden md:block" ref={reftwo}>
        <div
          className="grid grid-cols-2 p-0 md:p-4  gap-3 lg:gap-8 text-center "
          onClick={() => setCheckinOpen(!checkinOpen)}
        >
          <div className="grid col-span-1">
            <p className="">Check-in</p>
            {startDate ? (
              <p className="text-primary font-bold text-sm lg:text-lg">
                {startDate.toLocaleDateString()}
              </p>
            ) : (
              <p className="text-sm lg:text-lg">The first day!</p>
            )}
          </div>
          <div className="grid col-span-1">
            <p className="">Check-out</p>
            {endDate ? (
              <p className="text-primary font-bold text-sm lg:text-lg">
                {endDate.toLocaleDateString()}
              </p>
            ) : (
              <p className="text-sm lg:text-lg leading-7">The last day!</p>
            )}
          </div>
        </div>
        {checkinOpen && !showDropdown ? (
          <div
            className={`absolute dropdown dropdown-end bg-white p-0 lg:p-4 mt-2 lg:mt-2 rounded-lg z-40`}
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
                minDate={add(new Date(), { days: 1 })}
                selectsRange
                inline
              />
              <a
                onClick={() => reset()}
                className="text-primary underline cursor-pointer text-base"
              >
                Haven't decided dates yet?
              </a>
              <a
                onClick={() => reset()}
                className="text-primary cursor-pointer text-sm underline"
              >
                Reset
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div className="hidden md:block" ref={refthree}>
        <div
          className="cursor-pointer"
          onClick={() => setshowGuests(!showGuests)}
        >
          <div className=" grid flex-grow lg:min-w-[14rem] py-4 lg:p-4 text-center">
            <p className="text-lg">Guests</p>
            {adult ? (
              <p className="font-bold text-primary text-sm lg:text-lg">
                {adult} Adults
                {children ? <span>, {children} Children</span> : ""}
              </p>
            ) : (
              <p className="text-sm lg:text-lg">Who all are coming along?</p>
            )}
          </div>
        </div>
        {showGuests ? (
          <div className="absolute dropdown-content md:mt-3 lg:mt-1  card card-compact min-w-max p-1 shadow bg-base-100 text-neutral -right-0 lg:right-10">
            <div className="card-body text-left p-4 ">
              <div className="grid grid-cols-2 gap-1 lg:gap-4">
                <div className="grid col-span-1">
                  <p className="text-sm lg:text-lg font-bold">Adults</p>
                  <p>Age 12 years & above</p>
                </div>
                <div className="grid col-span-1 justify-center">
                  <Stepper value={adult} name="adult" reverse={setAdult} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid col-span-1">
                  <p className="text-sm lg:text-lg font-bold">Children</p>
                  <p>Between ages 5-12 years</p>
                </div>
                <div className="grid col-span-1 justify-center">
                  <Stepper
                    value={children}
                    name="child"
                    reverse={setChildren}
                  />
                </div>
              </div>
              <a
                onClick={() => {
                  setAdult(0);
                  setChildren(0);
                }}
                className="text-center text-primary text-sm underline cursor-pointer"
              >
                Reset
              </a>
            </div>
          </div>
        ) : null}
      </div>
      {adult !== 0 && startDate !== null && endDate !== null ? (
        <div
          onClick={
            inputType === "location"
              ? () =>
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
              : inputType == "property"
                ? () =>
                  router.push(
                    `/property/${propSlug}` +
                    "?startDate=" +
                    encodeURIComponent(startDate) +
                    "&endDate=" +
                    encodeURIComponent(endDate) +
                    "&adult=" +
                    adult +
                    "&child=" +
                    children
                  )
                : () => router.push(`/`)
          }
          className="md:grid mr-2 w-20 aspect-square bg-primary justify-center items-center h-full py-auto rounded-xl hidden cursor-pointer"
        >
          <MagnifyingGlassIcon className="w-8 text-base-100" />
        </div>
      ) : adult !== 0 && startDate === null && endDate === null ? (
        <div
          onClick={
            inputType === "location"
              ? () =>
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
              : inputType == "property"
                ? () =>
                  router.push(
                    `/property/${propSlug}` +
                    "?startDate=" +
                    encodeURIComponent(startDate) +
                    "&endDate=" +
                    encodeURIComponent(endDate) +
                    "&adult=" +
                    adult +
                    "&child=" +
                    children
                  )
                : () => router.push(`/`)
          }
          className="md:grid mr-2 w-20 aspect-square bg-primary justify-center items-center h-full py-auto rounded-xl hidden cursor-pointer"
        >
          <MagnifyingGlassIcon className="w-8 text-base-100" />
        </div>
      ) : startDate !== null && endDate !== null ? (
        <div
          onClick={
            inputType === "location"
              ? () =>
                router.push(
                  "/location/" +
                  town +
                  "?startDate=" +
                  encodeURIComponent(startDate) +
                  "&endDate=" +
                  encodeURIComponent(endDate) +
                  "&adult=" +
                  2 +
                  "&child=" +
                  0
                )
              : inputType == "property"
                ? () =>
                  router.push(
                    `/property/${propSlug}?startDate=${encodeURIComponent(
                      startDate
                    )}&endDate=${encodeURIComponent(
                      endDate
                    )}&adult=${2}&child=${0}`
                  )
                : () => router.push(`/`)
          }
          className="md:grid mr-2 w-20 aspect-square bg-primary justify-center items-center h-full py-auto rounded-xl hidden cursor-pointer"
        >
          <MagnifyingGlassIcon className="w-8 text-base-100" />
        </div>
      ) : startDate !== null && endDate === null ? (
        <div
          onClick={() => handleAlertert("Select checkout date ..!")}
          className="md:grid mr-2 w-20 aspect-square bg-primary justify-center items-center h-full py-auto rounded-xl hidden cursor-pointer"
        >
          <MagnifyingGlassIcon className="w-8 text-base-100" />
        </div>
      ) : (
        <div
          onClick={
            inputType === "location"
              ? () => router.push("/location/" + town)
              : inputType == "property"
                ? () => router.push(`/property/${propSlug}`)
                : () => router.push(`/`)
          }
          className="md:grid mr-2 w-20 aspect-square bg-primary justify-center items-center h-full py-auto rounded-xl hidden cursor-pointer"
        >
          <MagnifyingGlassIcon className="w-8 text-base-100" />
        </div>
      )}
      <MModal
        open={mmodal}
        from={setMmodal}
        value={value}
        propdata={propData}
      />
    </div>
  );
}
