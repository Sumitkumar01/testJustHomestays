import { useState, useEffect, useCallback, useRef } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import DatePicker from "react-datepicker";
import Stepper from "../numStepper";
import MModal2 from "../mobileModal2";
import { format, add } from "date-fns";
import axios from "axios";
import { RiListSettingsLine, RiSortDesc } from "react-icons/ri";
import Image from "next/image";
import MModal from "../mobileModal";

export default function Topbar(props) {
  const [location, setLocation] = useState("");
  const [loc, setLoc] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [value, setValue] = useState([]);
  const [rand, setRand] = useState([]);
  const [town, setTown] = useState("");
  const [mmodal2, setMmodal2] = useState(false);
  const [isProperty, setisProperty] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [propData, setPropData] = useState([]);
  const [filterPropData, setFilterPropData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputType, setInputType] = useState("");
  const [propTitle, setPropTitle] = useState("");
  const [propSlug, setPropSlug] = useState("");

  const refone = useRef(null);


  const dateChange = useCallback((dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  }, []);

  const reset = useCallback(() => {
    setStartDate(null);
    setendDate(null);
  }, []);

  useEffect(() => {
    const qPam = new URLSearchParams(window.location.search);
    if (
      qPam.get("startDate") != null &&
      qPam.get("startDate") != "null" &&
      !startDate
    ) {
      setStartDate(new Date(qPam.get("startDate")));
      setendDate(new Date(qPam.get("endDate")));
    }

    if (qPam.get("adult") != 0 && !adult) {
      setAdult(Number(qPam.get("adult")));
    }

    if (qPam.get("child") != 0 && !children) {
      setChildren(Number(qPam.get("child")));
    }
  }, []);

  const options = {
    method: "GET",
    url: process.env.API_URL + "Location",
    params: { limit: "100", where: "" },
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

  const getData = async () => {
    const tick = await axios.request(options);
    setLoc(tick.data.list);
    setArray(tick.data.list);
    if (rand.length == 0) {
      setRand(loc.sort(() => Math.random() - 0.5));
    }
  };

  useEffect(() => {
    if (window.location.href.indexOf("property") > -1) {
      setisProperty(true);
    }
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

  const handleOnClear = useCallback(() => {
    setLocation("");
    setSearch("");
    setShowDropdown(true);
  }, []);

  useEffect(() => {
    if (
      props.town &&
      props.state &&
      !showDropdown &&
      !location.length &&
      !propTitle
    ) {
      setLocation(props.town + ", " + props.state);
      setTown(props.town);
      setInputType("location");
    }
    if (props.adult > 0 && adult == 0) {
      setAdult(props.adult);
      setChildren(props.child);
    }
    if (
      props.sdate &&
      !startDate &&
      props.sdate != "null" &&
      props.sdate != null
    ) {
      setStartDate(new Date(props.sdate));
      setendDate(new Date(props.edate));
    }
  }, [props]);

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
    setShowDropdown(false);
  };

  const handleSelectProp = (item, type) => {
    setPropSlug(item.Slug);
    setPropTitle(item.Title);
    setInputType(type);
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
      
    }
    document.addEventListener('mousedown',handler)

    return () => {
      document.removeEventListener('mousedown',handler)
    }

  })

  return (
    <div className="sticky z-50 flex justify-center">
      <div className="lg:w-[1140px] w-full">
        <div className="bg-base-100 p-4 rounded-lg drop-shadow-xl mx-2 lg:mx-0">
          <div className="md:grid md:grid-cols-5 hidden">
            <div className="grid col-span-1 w-full">
              <div className="dropdown">
                <div tabIndex={0} className="cursor-pointer text-center" ref={refone}>
                  <p className="text-lg">Destination</p>
                  {location ? (
                    <p
                      onClick={handleOnClear}
                      className="text-primary font-bold"
                    >
                      {location}
                    </p>
                  ) : (
                    <div>
                      <input
                        value={inputType !== "property" ? search : propTitle}
                        onClick={() => setShowDropdown(true)}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Where are you going?"
                        autoFocus
                        className={`bg-transparent text-left placeholder:text-neutral focus:outline-none focus:placeholder:text-slate-500 ${
                          search.length > 0 ? "font-bold text-primary" : ""
                        } text-sm lg:text-lg`}
                      />
                      {showDropdown ? (
                        <div className="absolute bg-white p-4 mt-6 rounded-lg z-40 w-80">
                          {filteredData.length === 0 &&
                            filterPropData.length === 0 && (
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
                                    onClick={() =>
                                      handleSelectItem(item, "location")
                                    }
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
                                filterPropData
                                  .slice(0, 6)
                                  .map((item, index) => (
                                    <div
                                      key={index}
                                      onClick={() =>
                                        handleSelectProp(item, "property")
                                      }
                                      className="dropdown-item py-2 hover:bg-slate-300 rounded cursor-pointer"
                                    >
                                      {item.Title}
                                    </div>
                                  ))}
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="grid grid-cols-3 gap-2">
                            {filteredData.length === 0 &&
                              filterPropData.length === 0 &&
                              value.slice(0, 6).map((item, index) => (
                                <div
                                  key={index}
                                  onClick={() =>
                                    handleSelectItem(item, "location")
                                  }
                                  className="dropdown-item p-2 hover:bg-slate-300 rounded cursor-pointer"
                                >
                                  <Image
                                    src={
                                      "https://test.justhomestay.in/" +
                                      item.image
                                    }
                                    width={300}
                                    height={400}
                                    className="rounded-lg"
                                  />
                                  <p className="pt-2 text-center">
                                    {item.town}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid md:col-span-2 col-span-1 md:mt-0 mt-2">
              <div className="dropdown">
                <div tabIndex={1} className="cursor-pointer">
                  <div className="grid grid-cols-2 flex-grow pl-2 lg:px-8 gap-4 lg:gap-8">
                    <div className="grid col-span-1  text-center">
                      <p className="text-lg">Check-in</p>
                      {startDate ? (
                        <p className="text-primary font-bold">
                          {format(new Date(startDate), "dd-MM-yyyy")}
                        </p>
                      ) : (
                        <p>The first day!</p>
                      )}
                    </div>
                    <div className="grid col-span-1  text-center">
                      <p className="text-lg">Check-out</p>
                      {endDate ? (
                        <p className="text-primary font-bold">
                          {format(new Date(endDate), "dd-MM-yyyy")}
                        </p>
                      ) : (
                        <p>The last day!</p>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  tabIndex={1}
                  id="dateDropdown"
                  className="dropdown-content mt-2 md:mt-6 card card-compact md:w-max w-full p-1 shadow bg-base-100 text-neutral"
                >
                  <div className="card-body text-center items-center">
                    <p className="pb-4 text-base font-bold">
                      Select Check-in & Check-out dates
                    </p>
                    <DatePicker
                      onChange={dateChange}
                      selected={startDate}
                      startDate={startDate}
                      endDate={endDate}
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
                  </div>
                  <div className="my-4 lock md:hidden text-center justify-center">
                    <p
                      className="pointer-cursor py-2 px-6 bg-primary text-white font-bold uppercase rounded-xl w-max mx-auto"
                      onClick={(e) =>
                        document.getElementById("dateDropdown").blur()
                      }
                    >
                      Done
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid col-span-1 md:mt-0 mt-2 ">
              <div className="dropdown">
                <div tabIndex={2} className="cursor-pointer">
                  <div className="grid flex-grow min-w-[8rem] lg:min-w-[14rem]  text-center">
                    <p className="text-lg">Guests</p>
                    {adult ? (
                      <p className="font-bold text-primary">
                        {adult} Adults
                        {children ? <span>, {children} Children</span> : ""}
                      </p>
                    ) : (
                      <p className=" text-sm lg:text-lg">
                        Who all are coming along?
                      </p>
                    )}
                  </div>
                </div>
                <div
                  tabIndex={2}
                  id="guestDropdown"
                  className="absolute dropdown-content mt-2 md:mt-6 card card-compact md:w-[20rem] lg:w-[30rem] w-full shadow bg-base-100 text-neutral -left-5"
                >
                  <div className="card-body md:text-left text-center p-2 items-center">
                    <div className="grid md:grid-cols-3  w-full">
                      <div className="grid md:col-span-2">
                        <p className="text-lg font-bold">Adults</p>
                        <p>Age 12 years & above</p>
                      </div>
                      <div className="grid md:col-span-1 items-center">
                        <Stepper
                          value={adult}
                          name="adult"
                          reverse={setAdult}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 w-full mt-4">
                      <div className="grid md:col-span-2">
                        <p className="text-lg font-bold">Children</p>
                        <p>Between ages 5-12 years</p>
                      </div>
                      <div className="grid md:col-span-1 items-center">
                        <Stepper
                          value={children}
                          name="child"
                          reverse={setChildren}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="my-4 lock md:hidden text-center justify-center">
                    <p
                      className="pointer-cursor py-2 px-6 bg-primary text-white font-bold uppercase rounded-xl w-max mx-auto"
                      onClick={(e) =>
                        document.getElementById("guestDropdown").blur()
                      }
                    >
                      Done
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid col-span-1 md:mt-0 mt-4">
              <div className="flex justify-around">
                {adult !== 0 && startDate !== null && endDate !== null ? (
                  <a
                    href={
                      inputType === "location"
                        ? "/location/" +
                          town +
                          "?startDate=" +
                          encodeURIComponent(startDate) +
                          "&endDate=" +
                          encodeURIComponent(endDate) +
                          "&adult=" +
                          adult +
                          "&child=" +
                          children
                        : inputType == "property"
                        ? `/property/${propSlug}?startDate=${encodeURIComponent(
                            startDate
                          )}&endDate=${encodeURIComponent(
                            endDate
                          )}&adult=${adult}&child=${children}`
                        : `/`
                    }
                  >
                    <button className="px-4 lg:px-8 w-full h-[70%] lg:h-full bg-primary text-white text-lg rounded-lg font-bold">
                      Search
                    </button>
                  </a>
                ) : adult !== 0 && startDate === null && endDate === null ? (
                  <a
                    href={
                      inputType === "location"
                        ? "/location/" +
                          town +
                          "?startDate=" +
                          encodeURIComponent(startDate) +
                          "&endDate=" +
                          encodeURIComponent(endDate) +
                          "&adult=" +
                          adult +
                          "&child=" +
                          children
                        : inputType == "property"
                        ? `/property/${propSlug}?startDate=${encodeURIComponent(
                            startDate
                          )}&endDate=${encodeURIComponent(
                            endDate
                          )}&adult=${adult}&child=${children}`
                        : `/`
                    }
                  >
                    <button className="px-4 lg:px-8 w-full h-[70%] lg:h-full bg-primary text-white text-lg rounded-lg font-bold">
                      Search
                    </button>
                  </a>
                ) : startDate !== null && endDate !== null ? (
                  <a
                    href={
                      inputType === "location"
                        ? "/location/" +
                          town +
                          "?startDate=" +
                          encodeURIComponent(startDate) +
                          "&endDate=" +
                          encodeURIComponent(endDate) +
                          "&adult=" +
                          2 +
                          "&child=" +
                          0
                        : inputType == "property"
                        ? `/property/${propSlug}?startDate=${encodeURIComponent(
                            startDate
                          )}&endDate=${encodeURIComponent(
                            endDate
                          )}&adult=${2}&child=${0}`
                        : `/`
                    }
                  >
                    <button className="px-4 lg:px-8 w-full h-[70%] lg:h-full bg-primary  text-white text-lg rounded-lg font-bold">
                      Search
                    </button>
                  </a>
                ) : startDate !== null && endDate === null ? (
                  <a>
                    <button
                      onClick={() => handleAlertert("Select checkout date ..!")}
                      className="px-4 lg:px-8 w-full h-[70%] lg:h-full bg-primary  text-white text-lg rounded-lg font-bold"
                    >
                      Search
                    </button>
                  </a>
                ) : (
                  <a
                    href={
                      inputType === "location"
                        ? "/location/" + town
                        : inputType == "property"
                        ? `/property/${propSlug}`
                        : `/`
                    }
                  >
                    <button className="px-4 lg:px-8 w-full h-[70%] lg:h-full bg-primary  text-white text-lg rounded-lg font-bold">
                      Search
                    </button>
                  </a>
                )}
              
                {isProperty ? null : (
                  <>
                    <RiListSettingsLine
                      onClick={() => props.fmodal(true)}
                      className="w-8 h-8 text-primary my-auto cursor-pointer mx-2"
                    />
                    <RiSortDesc
                      onClick={() => props.smodal(true)}
                      className="w-8 h-8 text-primary my-auto cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden grid grid-cols-6">
            <p
              className="text-center col-span-6"
              onClick={(e) => setMmodal2(true)}
            >
              {location +
                (startDate && endDate
                  ? " | " +
                    format(new Date(startDate), "dd-LLL") +
                    " - " +
                    format(new Date(endDate), "dd-LLL")
                  : "") +
                (adult && children
                  ? " | " +
                    (children
                      ? adult + " Adults " + children + " Kids"
                      : adult + " Adults")
                  : "")}
            </p>
            <hr className="my-2 col-span-6" />
            <div className="col-span-6 grid grid-cols-2">
              <div className="col-span-1">
                <div
                  onClick={() => props.fmodal(true)}
                  className="flex justify-center gap-x-4"
                >
                  <RiListSettingsLine className="w-8 h-8 text-primary my-auto cursor-pointer" />
                  <p className="my-auto">Filters</p>
                </div>
              </div>
              <div className="col-span-1">
                <div
                  onClick={() => props.smodal(true)}
                  className="flex justify-center gap-x-4"
                >
                  <RiSortDesc className="w-8 h-8 text-primary my-auto cursor-pointer" />
                  <p className="my-auto">Sort</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <MModal2
        open={mmodal2}
        from={setMmodal2}
        location={location}
        town={town}
        startDate={startDate}
        endDate={endDate}
        adult={adult}
        children={children}
        inputType={inputType}
        propSlug={propSlug}
        handleAlertert={handleAlertert}
      /> */}
<MModal
      open={mmodal2}
      from={setMmodal2}
        value={value}
        propdata={propData}
      />
    </div>
  );
}
