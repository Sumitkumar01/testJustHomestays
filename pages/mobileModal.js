import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { format, add } from "date-fns";
import Stepper from "./numStepper";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";

export default function MModal(props) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const router = useRouter();
  const [dateopen, setDateopen] = useState(false);
  const [guestopen, setGuestopen] = useState(false);
  const [town, setTown] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLocation, setSearchlocation] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputType, setInputType] = useState("");
  const [propSlug, setPropSlug] = useState("");

  const dateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  };

  const reset = () => {
    setStartDate(null);
    setendDate(null);
  };

  useEffect(() => {
    const qPam = new URLSearchParams(window.location.search);
    if (qPam.get("startDate") != null) {
      setStartDate(new Date(qPam.get("startDate")));
    }
    if (qPam.get("endDate") != null) {
      setendDate(new Date(qPam.get("endDate")));
    }
    setAdult(Number(qPam.get("adult")));
    setChildren(Number(qPam.get("child")));
  }, [props.open]);

  useEffect(() => {
    setSearchResults(props.value.concat(props.propdata));
  }, [props.value, props.propdata]);

  const handleOnSelect = (item, type) => {
    if (type === "location") {
      setSelectedItem(item);
      setTown(item.town);
      setInputType(type);
    } else if (type === "property") {
      setSelectedItem(item);
      setInputType(type);
      setPropSlug(item.Slug);
    }
  };

  const handleOnClear = () => {
    setTown("");
    setSearchQuery("");
    setSelectedItem(null);
    setStartDate(null);
    setendDate(null);
    setDateopen(false);
    setAdult(0);
    setChildren(0);
    setGuestopen(false);
  };

  useEffect(() => {
    if (town) {
      setDateopen(true);
    }
  }, [town]);

  useEffect(() => {
    if (endDate) {
      setGuestopen(true);
    }
  }, [endDate]);

  const handlers = useSwipeable({
    onSwipedDown: () => {
      handleCancel();
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleCancel = () => {
    reset();
    handleOnClear();
    setAdult(0);
    setChildren(0);
    setDateopen(false);
    setGuestopen(false);
    props.from(false);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    const filteredResults = props.value
      .concat(props.propdata)
      .filter(
        (item) =>
          item?.town?.toLowerCase().includes(value.toLowerCase()) ||
          item?.state?.toLowerCase().includes(value.toLowerCase()) ||
          item?.Title?.toLowerCase().includes(value.toLowerCase())
      );
    setSearchResults(filteredResults);
  };

  const handleAlertert = (msg) => {
    alert(msg);
  }

  if (props.open) {
    return (
      <div className="backdrop justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div
          data-aos="fade-up"
          data-aos-duration="500"
          className="max-w-full absolute w-full bottom-0 p-4 text-right scale-100 bg-white h-[80vh] mt-4 z-50"
        >
          <div
            {...handlers}
            className="p-1 w-full justify-center mx-auto block md:hidden pb-2"
          >
            <div className="h-2 w-36 bg-neutral rounded-full mx-auto"></div>
          </div>
          <div className="flex flex-col place-content-between h-full pb-6 overflow-auto">
            <div>
              <div className="w-full md:hidden z-50 relative">
                <div className="w-full mt-4 border drop-shadow-lg rounded-box bg-base-100">
                  <div className="flex justify-between gap-x-4">
                    <div className="text-base px-4 pt-4 text-left ">
                      {selectedItem ? `Location` : `Select Location`}
                    </div>
                    {selectedItem ? (
                      <p className="text-base font-bold text-right px-4 pt-4 text-primary">
                        {selectedItem.town || selectedItem.Title}
                      </p>
                    ) : null}
                  </div>
                  {selectedItem ? (
                    <a
                      className="cursor-pointer"
                      onClick={() => handleOnClear()}
                    >
                      <p className="my-4 text-center">Reset Destination</p>
                    </a>
                  ) : (
                    <div className="p-4 z-50">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Destination"
                        className="input w-full bg-transparent border-b focus:outline-none"
                      />
                      <div className="text-left">
                        {searchResults &&
                          searchQuery &&
                          searchResults.slice(0, 4).map((result) => (
                            <p
                              className="py-2"
                              onClick={() =>
                                handleOnSelect(
                                  result,
                                  result.town
                                    ? "location"
                                    : result.Title
                                    ? "property"
                                    : null
                                )
                              }
                            >
                              {result.town || result.Title}
                            </p>
                          ))}
                      </div>
                      <a href="/category/NearbyProperties">
                        <p className="mt-4 text-center text-primary">
                          Explore Nearby Properties
                        </p>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center -z-50">
                <div
                  tabIndex={0}
                  className={
                    dateopen == true
                      ? "collapse-open collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                      : "collapse-close collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                  }
                >
                  <div
                    className="collapse-title text-left"
                    onClick={() => setDateopen(!dateopen)}
                  >
                    When are you planning to travel?
                  </div>
                  <div className="collapse-content">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold text-center text-lg mt-8">
                          Check-in Date
                        </p>
                        {startDate ? (
                          <p className="text-primary font-bold">
                            {startDate.toLocaleDateString()}
                          </p>
                        ) : (
                          <p>The first day!</p>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-center text-lg mt-8">
                          Check-out Date
                        </p>
                        {endDate ? (
                          <p className="text-primary font-bold">
                            {endDate.toLocaleDateString()}
                          </p>
                        ) : (
                          <p>The last day!</p>
                        )}
                      </div>
                    </div>
                    {!startDate || !endDate ? (
                      <div className="mt-4">
                        <DatePicker
                          onChange={dateChange}
                          startDate={startDate}
                          endDate={endDate}
                          minDate={add(new Date(), { days: 1 })}
                          selectsRange
                          inline
                        />
                        <div onClick={() => setDateopen(false)}>
                          <p className="text-center cursor-pointer mt-4 p-2">
                            Haven't decided dates yet?
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4" onClick={() => reset()}>
                        Reset Dates
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div
                tabIndex={1}
                className={
                  guestopen == true
                    ? "collapse-open collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                    : "collapse-close collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                }
              >
                <div
                  className="collapse-title text-left"
                  onClick={() => setGuestopen(!guestopen)}
                >
                  Who all will be travelling with you?
                </div>
                <div className="collapse-content w-full">
                  <div className="flex justify-between mt-4 text-left">
                    <div className="col-span-2">
                      <p className="text-lg font-bold">Adults</p>
                      <p>Age 12 years & above</p>
                    </div>
                    <div className="col-span-1">
                      <Stepper value={adult} name="adult" reverse={setAdult} />
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-left">
                    <div className="grid col-span-2">
                      <p className="text-lg font-bold">Children</p>
                      <p>Between ages 5-12 years</p>
                    </div>
                    <div className="grid col-span-1">
                      <Stepper
                        value={children}
                        name="child"
                        reverse={setChildren}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(selectedItem?.town || selectedItem?.Title) && (
              <div>
                {adult !== 0 && startDate !== null && endDate !== null ? (
                  <a
                    href={
                      inputType === "location"
                        ?  "/location/" +
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
                        ? `/property/${propSlug}` +
                        "?startDate=" +
                        encodeURIComponent(startDate) +
                        "&endDate=" +
                        encodeURIComponent(endDate) +
                        "&adult=" +
                        adult +
                        "&child=" +
                        children
                        : "/"
                    }
                  >
                    <div className="bg-primary justify-center items-center py-2 w-full rounded-lg cursor-pointer text-white text-center mx-auto">
                      Search
                    </div>
                  </a>
                ) : adult !== 0 && startDate === null && endDate === null ?(
                  <a
                    href={
                      inputType === "location"
                        ?  "/location/" +
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
                        ? `/property/${propSlug}` +
                        "?startDate=" +
                        encodeURIComponent(startDate) +
                        "&endDate=" +
                        encodeURIComponent(endDate) +
                        "&adult=" +
                        adult +
                        "&child=" +
                        children
                        : "/"
                    }
                  >
                    <div className="bg-primary justify-center items-center py-2 w-full rounded-lg cursor-pointer text-white text-center mx-auto">
                      Search
                    </div>
                  </a>
                ) :  startDate !== null && endDate !== null ? (
                  <a
                  href={
                    inputType === "location"
                      ?  "/location/" +
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
                      )}&endDate=${encodeURIComponent(endDate)}&adult=${2}&child=${0}`
                      : "/"
                  }
                >
                  <div className="bg-primary justify-center items-center py-2 w-full rounded-lg cursor-pointer text-white text-center mx-auto">
                    Search
                  </div>
                </a>
                ) : startDate !== null && endDate === null ? (
                  <a>
                    <div onClick={() => handleAlertert("Select checkout date ..!")} className="bg-primary justify-center items-center py-2 w-full rounded-lg cursor-pointer text-white text-center mx-auto">
                    Search
                  </div>
                  </a>
                ) : (
                  <a
                    href={
                      inputType === "location"
                        ? "/location/" + town
                        : inputType == "property"
                        ? `/property/${propSlug}`
                        : "/"
                    }
                  >
                    <div className="bg-primary justify-center items-center py-2 w-full rounded-lg cursor-pointer text-white text-center mx-auto">
                      Search
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
