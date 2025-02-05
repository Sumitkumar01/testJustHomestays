import { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import { add } from "date-fns";
import Stepper from "./numStepper";
import { useRouter } from "next/router";
import { BsXLg } from "react-icons/bs";
import { useSwipeable } from "react-swipeable";

export default function MModal2(props) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [location, setLocation] = useState([]);
  const router = useRouter();
  const [dateopen, setDateopen] = useState(false);
  const [guestopen, setGuestopen] = useState(false);

  useEffect(() => {
    setLocation(props.location);
    setStartDate(props.startDate);
    setendDate(props.endDate);
    setAdult(props.adult);
    setChildren(props.children);
  }, [props.location]);

  const dateChange = useCallback((dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  }, []);

  const reset = useCallback(() => {
    setStartDate(null);
    setendDate(null);
  }, []);

  const handlers = useSwipeable({
    onSwipedDown: () => {
      handleCancel();
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleCancel = () => {
    setDateopen(false);
    setGuestopen(false);
    props.from(false);
  };



  if (props.open && location) {
    return (
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        className="backdrop items-end justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="max-w-full w-full bottom-0 modal-box p-4 text-right scale-100 rounded-b-none mt-12">
        <div
            {...handlers}
            className="p-1 w-full justify-center mx-auto block md:hidden pb-2"
          >
            <div className="h-2 w-36 bg-neutral rounded-full mx-auto"></div>
          </div>
          {/* <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
              onClick={() => props.from(false)}
            >
              <BsXLg className="h-6 w-6" />
            </button>
          </div> */}
          <div className="text-center">
            <p className="font-bold text-center text-lg">Location</p>
            <p
              className="text-primary font-bold text-center text-lg
          "
            >
              {location}
            </p>
            <div
              tabIndex={0}
              className={
                dateopen == true
                  ? "collapse-open collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                  : "collapse-close collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
              }
            >
              <div className="collapse-title" onClick={() => setDateopen(true)}>
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
            <div className="collapse-title" onClick={() => setGuestopen(true)}>
              <p className="text-center">
                Who all will be travelling with you?
              </p>
            </div>
            <div className="collapse-content">
              <p className="font-bold text-center text-lg mt-4">Adults</p>
              <p className="text-center text-sm">Age 12 years & above</p>
              <div className="w-full justify-center mt-4">
                <Stepper value={adult} name="adult" reverse={setAdult} />
              </div>
              <p className="font-bold text-center text-lg mt-4">Children</p>
              <p className="text-center text-sm">Between ages 5-12 years</p>
              <div className="w-full justify-center mt-4">
                <Stepper value={children} name="child" reverse={setChildren} />
              </div>
            </div>
          </div>
          {adult !== 0 && startDate !== null && endDate !== null ? (
            <a
              href={
                props.inputType === "location"
                  ? "/location/" +
                  props.town +
                    "?startDate=" +
                    encodeURIComponent(startDate) +
                    "&endDate=" +
                    encodeURIComponent(endDate) +
                    "&adult=" +
                    adult +
                    "&child=" +
                    children
                  :  props.inputType == "property"
                  ? `/property/${props.propSlug}?startDate=${encodeURIComponent(
                      startDate
                    )}&endDate=${encodeURIComponent(
                      endDate
                    )}&adult=${adult}&child=${children}`
                  : `/`
              }
            >
              <div className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded cursor-pointer text-white text-center mx-auto mt-4">
                Search
              </div>
            </a>
          ) : adult !== 0 && startDate === null && endDate === null ? (
            <a
              href={
                props.inputType === "location"
                  ? "/location/" +
                  props.town +
                    "?startDate=" +
                    encodeURIComponent(startDate) +
                    "&endDate=" +
                    encodeURIComponent(endDate) +
                    "&adult=" +
                    adult +
                    "&child=" +
                    children
                  :  props.inputType == "property"
                  ? `/property/${props.propSlug}?startDate=${encodeURIComponent(
                      startDate
                    )}&endDate=${encodeURIComponent(
                      endDate
                    )}&adult=${adult}&child=${children}`
                  : `/`
              }
            >
              <div className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded cursor-pointer text-white text-center mx-auto mt-4">
                Search
              </div>
            </a>
          ) : startDate !== null && endDate !== null ? (
            <a
              href={
                props.inputType === "location"
                  ? "/location/" +
                  props.town +
                    "?startDate=" +
                    encodeURIComponent(startDate) +
                    "&endDate=" +
                    encodeURIComponent(endDate) +
                    "&adult=" +
                    2 +
                    "&child=" +
                    0
                  :  props.inputType == "property"
                  ? `/property/${props.propSlug}?startDate=${encodeURIComponent(
                      startDate
                    )}&endDate=${encodeURIComponent(
                      endDate
                    )}&adult=${2}&child=${0}`
                  : `/`
              }
            >
              <div className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded cursor-pointer text-white text-center mx-auto mt-4">
                Search
              </div>
            </a>
          ) : startDate !== null && endDate === null ? (
            <a>
              <div
                onClick={() => props.handleAlertert("Select checkout date ..!")}
                className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded cursor-pointer text-white text-center mx-auto mt-4"
              >
                Search
              </div>
            </a>
          ) : (
            <a
              href={
                props.inputType === "location"
                  ? "/location/" + props.town
                  : props.inputType == "property"
                  ? `/property/${props.propSlug}`
                  : `/`
              }
            >
              <div className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded cursor-pointer text-white text-center mx-auto mt-4">
                Search
              </div>
            </a>
          )}
          {/* {startDate == null && adult == 0 ? (
            <div
              onClick={() => props.from(false)}
              className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded-full cursor-pointer text-white text-center mx-auto mt-4"
            >
              Search
            </div>
          ) : (
            <a
              href={
                "/location/" +
                props.town +
                "?startDate=" +
                encodeURIComponent(startDate) +
                "&endDate=" +
                encodeURIComponent(endDate) +
                "&adult=" +
                adult +
                "&child=" +
                children
              }
            >
              <div className="bg-primary justify-center items-center h-full py-2 px-16 w-max rounded cursor-pointer text-white text-center mx-auto mt-4">
                Search
              </div>
            </a>
          )} */}
        </div>
      </div>
    );
  }
}
