import { useState, useEffect, useCallback } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import DatePicker from "react-datepicker";
import {
  AdjustmentsVerticalIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import Stepper from "../numStepper";
import Filter from "./filters";
import MModal2 from "../mobileModal2";
import { format, add } from "date-fns";
import axios from "axios";

export default function Topbar(props) {
  const [filter, showFilter] = useState(false);
  const [location, setLocation] = useState("");
  const [loc, setLoc] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [value, setValue] = useState([]);
  const [rand, setRand] = useState([]);
  const [town, setTown] = useState("");
  const [total, setTotal] = useState(0);
  const [uvalue, setUvalue] = useState(0);
  const [lvalue, setLvalue] = useState(0);
  const [lft, setlFt] = useState(0);
  const [uft, setuFt] = useState(0);
  const [mmodal2, setMmodal2] = useState(false);
  const [nv, newValue] = useState(false);

  const dateChange = useCallback((dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  }, []);

  const reset = useCallback(() => {
    setStartDate(null);
    setendDate(null);
  }, []);

  const options = {
    method: "GET",
    url: process.env.API_URL + "Location",
    params: { limit: "100", where: "" },
    headers: {
      "xc-token": process.env.API_KEY
    }
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
  }, []);

  const setArray = (tick) => {
    var data = tick.map((lc, index) => ({
      ...data,
      id: index + 1,
      town: lc.Town,
      state: lc.State
    }));
    setValue(data);
  };

  const handleOnSelect = useCallback((item) => {
    setLocation(item.town + ", " + item.state);
    setTown(item.town);
  }, []);

  const handleOnClear = useCallback(() => {
    setLocation("");
  }, []);

  useEffect(() => {
    if (props.town) {
      setLocation(props.town + ", " + props.state);
      setTown(props.town);
    }
    if (props.adult > 0) {
      setAdult(props.adult);
      setChildren(props.child);
      setTotal(Number(props.adult) + Number(props.child));
    }
    if (props.sdate) {
      setStartDate(new Date(props.sdate));
      setendDate(new Date(props.edate));
    }
  }, [props]);

  useEffect(() => {
    if (!props.isProperty) {
      props.lvalue(lvalue);
      props.uvalue(uvalue);
      if (total == 0) {
        props.ltotal(lft);
        props.utotal(uft);
      }
      props.nv(true);
    }
  }, [lvalue, uvalue, lft, uft, props.isProperty]);

  return (
    <div className="sticky z-50 flex justify-center">
      <div className="lg:w-[1140px] w-full">
        <div className="bg-base-100 p-4 rounded-lg drop-shadow-xl">
          <div className="md:grid md:grid-cols-5 hidden">
            <div className="grid col-span-1 w-full">
              <div className="dropdown">
                <div tabIndex={0} className="cursor-pointer">
                  <p className="text-lg">Destination</p>
                  {location ? (
                    <p
                      onClick={handleOnClear}
                      className="text-primary font-bold"
                    >
                      {location}
                    </p>
                  ) : (
                    <ReactSearchAutocomplete
                      items={value}
                      fuseOptions={{ keys: ["town", "state"] }}
                      resultStringKeyName="town"
                      onSelect={handleOnSelect}
                      onClear={handleOnClear}
                      styling={{ zIndex: 4 }} // To display it on top of the search box below
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="grid md:col-span-2 col-span-1 md:mt-0 mt-2">
              <div className="dropdown">
                <div tabIndex={1} className="cursor-pointer">
                  <div className="grid grid-cols-2 flex-grow md:px-8 gap-8">
                    <div className="grid col-span-1">
                      <p className="text-lg">Check-in</p>
                      {startDate ? (
                        <p className="text-primary font-bold">
                          {format(new Date(startDate), "dd-MM-yyyy")}
                        </p>
                      ) : (
                        <p>The first day!</p>
                      )}
                    </div>
                    <div className="grid col-span-1">
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
                  className="dropdown-content mt-2 card card-compact md:w-max w-full p-1 shadow bg-base-100 text-neutral"
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
            <div className="grid col-span-1 md:mt-0 mt-2">
              <div className="dropdown">
                <div tabIndex={2} className="cursor-pointer">
                  <div className="grid flex-grow md:min-w-[14rem]">
                    <p className="text-lg">Guests</p>
                    {adult ? (
                      <p className="font-bold text-primary">
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
                  id="guestDropdown"
                  className="dropdown-content mt-2 card card-compact md:w-[30rem] w-full p-1 shadow bg-base-100 text-neutral"
                >
                  <div className="card-body md:text-left text-center p-4 items-center">
                    <div className="grid md:grid-cols-3 md:gap-4 w-full">
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
                    <div className="grid md:grid-cols-3 md:gap-4 w-full mt-4">
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
              <div className="grid grid-cols-3 gap-x-4">
                <div className="grid col-span-2">
                  {adult == 0 ? (
                    <a href={"/location/" + town}>
                      <button className="w-full h-full bg-primary text-white text-lg rounded-lg font-bold">
                        Search
                      </button>
                    </a>
                  ) : (
                    <a
                      href={
                        "/location/" +
                        town +
                        "?startDate=" +
                        startDate +
                        "&endDate=" +
                        endDate +
                        "&adult=" +
                        adult +
                        "&child=" +
                        children
                      }
                    >
                      <button className="w-full h-full bg-primary text-white text-lg rounded-lg font-bold">
                        Search
                      </button>
                    </a>
                  )}
                </div>
                <div className="grid col-span-1">
                  <AdjustmentsVerticalIcon
                    onClick={() => showFilter(true)}
                    className="w-8 justify-self-center self-center cursor-pointer"
                  />
                </div>
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
          </div>
          <div className="md:hidden grid grid-cols-6 gap-x-2 text-center mt-2">
            <p className="col-span-3 w-full" onClick={() => showFilter(true)}>
              Filters{" "}
              <ChevronRightIcon className="w-4 justify-self-center self-center cursor-pointer col-span-1 inline" />
            </p>
            <p className="col-span-3 w-full inline">
              Sort By{" "}
              <ChevronRightIcon className="w-4 justify-self-center self-center cursor-pointer col-span-1 inline" />
            </p>
          </div>
        </div>
      </div>
      {props.data && total == 0 ? (
        <Filter
          open={filter}
          from={showFilter}
          array={props.data}
          lv={setLvalue}
          uv={setUvalue}
          ltotal={setlFt}
          utotal={setuFt}
          nv={newValue}
        />
      ) : null}
      {props.data && total > 0 ? (
        <Filter
          open={filter}
          from={showFilter}
          array={props.data}
          total={total}
          lv={setLvalue}
          uv={setUvalue}
          nv={newValue}
        />
      ) : null}
      <MModal2
        open={mmodal2}
        from={setMmodal2}
        location={location}
        town={town}
        startDate={startDate}
        endDate={endDate}
        adult={adult}
        children={children}
      />
    </div>
  );
}
