import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Availability from "./property/availability";
import Stepper from "./numStepper";
import { differenceInDays } from "date-fns";
import { useRouter } from "next/router";
import SubmitManager from "./property/stayManager";
import { useSwipeable } from "react-swipeable";
import { capitalCase } from "change-case";

function checkoutModal({ open, from, blogs, ptype, booked }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [available, setAvailable] = useState();
  const [check, setCheck] = useState(0);
  const [dateopen, setDateopen] = useState(true);
  const [a, setA] = useState();
  const [b, setB] = useState();
  const [c, setC] = useState();
  var final = 0;
  var extraA = 0;
  var extraC = 0;
  var extraCost = 0;
  var night = 0;
  var tg = 0;
  const router = useRouter();
  const dateChange = (dates) => {
    setAvailable(null);
    setCheck(0);
    setA();
    setB();
    setC();
    const [start, end] = dates;
    setStartDate(start);
    setendDate(end);
  };
  const [showContact, setsContact] = useState(false);

  const reset = () => {
    setStartDate(null);
    setendDate(null);
  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      handleCancel();
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleCancel = () => {
    close();
  };

  const sendEvent = (title, value) => {
    window.gtag("event", "booking_started", {
      event_category: "Conversion",
      event_label: "User clicked on a property",
      prop_name: title,
      prop_value: value,
    });
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
  }, [open]);

  if (endDate) {
    night = differenceInDays(new Date(endDate), new Date(startDate));
  }

  if (adult > 0) {
    tg = Number(adult) + Number(children);
    if (tg > blogs["Guests Included"]) {
      if (adult > blogs["Guests Included"] && !children) {
        extraA = tg - blogs["Guests Included"];
        extraC = 0;
      } else if (adult > blogs["Guests Included"] && children > 0) {
        extraA = adult - blogs["Guests Included"];
        extraC = tg - adult;
      } else {
        extraA = 0;
        extraC = tg - blogs["Guests Included"];
      }
    } else {
      extraCost = 0;
    }
  } else {
    extraCost = 0;
  }

  if (extraA > 0 && extraC > 0) {
    extraCost =
      extraA * Number(blogs["Extra Cost per Adult"]) +
      extraC * Number(blogs["Extra Cost per Child"]);
  } else if (extraA > 0 && extraC == 0) {
    extraCost = extraA * Number(blogs["Extra Cost per Adult"]);
  } else if (extraA == 0 && extraC > 0) {
    extraCost = extraC * Number(blogs["Extra Cost per Child"]);
  } else {
    extraCost = 0;
  }

  if (night > 0) {
    if (extraCost == 0) {
      final = Number(blogs["Cost per Night"]) * night;
    } else {
      final = (Number(blogs["Cost per Night"]) + extraCost) * night;
    }
  } else {
    final = 0;
  }

  function close() {
    from(false);
  }

  if (open) {
    return (
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        className="backdrop justify-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="max-w-full w-full bottom-0 p-4 text-right scale-100 bg-base-100 h-[80vh] max-h-[80vh] fixed overflow-y-auto">
          <div
            {...handlers}
            className="p-1 w-full justify-center mx-auto block md:hidden pb-2"
          >
            <div className="h-2 w-36 bg-neutral rounded-full mx-auto"></div>
          </div>
          <div className="text-center pt-2">
            <h1 className="text-2xl font-semibold">{blogs.Title}</h1>
            {blogs.Town ? (
              <p className="text-base text-slate-700 mt-1">
                {capitalCase(blogs.Town) + ", " + capitalCase(blogs.State)}
              </p>
            ) : (
              <></>
            )}
            <p className="pb-2">
              {blogs["Number of Bedrooms"]} bedrooms
              <span className="text-xl font-bold"> · </span>
              {blogs["Number of Bathrooms"]} bathrooms
              <span className="text-xl font-bold"> · </span>
              {blogs["Total Guests"]} guests
            </p>
            <div className="divider2x" />
          </div>

          <div className="md:hidden mt-4 md:mt-0 text-left overflow-y-auto max-h-[75vh]">
            {blogs["Instant Booking"] ? (
              <div className=" h-max  md:p-6 pb-4 sticky top-4">
                <p className="mt-4 font-bold">
                  Select check-in & check-out dates
                </p>

                <div className="text-center z-0">
                  <div
                    tabIndex={0}
                    className={
                      dateopen == true
                        ? "collapse-open collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                        : "collapse-close collapse collapse-arrow border bg-base-100 rounded-box drop-shadow-lg mt-4"
                    }
                  >
                    <div
                      className="collapse-title"
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
                            minDate={new Date()}
                            selected={startDate}
                            selectsRange
                            inline
                            excludeDates={booked}
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

                {endDate && ptype == "JHS" ? (
                  <Availability
                    eDate={endDate}
                    sDate={startDate}
                    ptype={ptype}
                    calendar={blogs["Calendar ID"]}
                    avail={setAvailable}
                  />
                ) : null}
                {!endDate && ptype == "JHS" ? (
                  <p className="mt-4 text-warning">Select dates to continue</p>
                ) : null}
                {available == 0 && ptype == "JHS" ? (
                  <p className="mt-4">Dates are Booked</p>
                ) : null}
                {available == 1 && ptype == "JHS" ? (
                  <>
                    <p className="mt-6 font-bold">Select guests</p>
                    <div className="flex justify-between mt-4">
                      <div className="col-span-2">
                        <p className="text-lg font-bold">Adults</p>
                        <p>Age 12 years & above</p>
                      </div>
                      <div className="col-span-1">
                        <Stepper
                          value={adult}
                          name="adult"
                          reverse={setAdult}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
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
                    {tg > 0 && tg <= blogs["Total Guests"] ? (
                      <div className="mt-4">
                        <p className="text-center text-lg font-bold">Cost</p>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="grid col-span-2 gap-y-2">
                            <p>Cost per Night</p>
                            <p>No. of Nights</p>
                            <p>Total Cost</p>
                            <p className="text-sm">(Taxes additional)</p>
                          </div>
                          <div className="grid col-span-1 gap-y-2 text-right">
                            <p>{final / night}</p>
                            <p>{night}</p>
                            <p>{final}</p>
                            <p></p>
                          </div>
                        </div>
                        <div className="mt-8 text-center mx-auto">
                          <button
                            onClick={() =>
                              router.push(
                                "../checkout/" +
                                  blogs.Slug +
                                  "?id=" +
                                  blogs.PID +
                                  "&startDate=" +
                                  encodeURIComponent(startDate) +
                                  "&endDate=" +
                                  encodeURIComponent(endDate) +
                                  "&adults=" +
                                  adult +
                                  "&child=" +
                                  children +
                                  "&type=" +
                                  blogs.Type +
                                  "&total=" +
                                  final
                              )
                            }
                            className="bg-primary text-base-100 rounded-lg px-6 py-2"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-warning">
                        <p>
                          Maximum guests allowed are {blogs["Total Guests"]}
                        </p>
                      </div>
                    )}
                  </>
                ) : null}
                {ptype == "SV" && endDate ? (
                  <div className="bg-base-100 rounded-xl shadow-xl p-4 mb-4">
                    <p className="mt-6 font-bold">Select guests</p>
                    <div className="flex justify-between mt-4">
                      <div className="grid col-span-2">
                        <p className="text-lg font-bold">Adults</p>
                        <p>Age 12 years & above</p>
                      </div>
                      <div className="grid col-span-1">
                        <Stepper
                          value={adult}
                          name="adult"
                          reverse={setAdult}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
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
                    {tg > 0 && tg <= blogs["Total Guests"] && check == 1 ? (
                      <Availability
                        eDate={endDate}
                        sDate={startDate}
                        ptype={ptype}
                        avail={setAvailable}
                        pid={blogs["PID"]}
                        adult={adult}
                        child={children}
                        cpn={setA}
                        nights={setB}
                        total={setC}
                      />
                    ) : (
                      <div className="mt-4 text-warning">
                        Maximum guests allowed are {blogs["Total Guests"]}
                      </div>
                    )}
                    {available == 0 ? (
                      <div className="mt-4 text-warning">Dates are booked</div>
                    ) : null}
                    {tg > 0 && tg <= blogs["Total Guests"] && available == 1 ? (
                      <div className="mt-4">
                        <p className="text-center text-lg font-bold">Cost</p>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="grid col-span-2 gap-y-2">
                            <p>Cost per Night</p>
                            <p>No. of Nights</p>
                            <p>Total Cost</p>
                            <p className="text-sm">(Taxes additional)</p>
                          </div>
                          <div className="grid col-span-1 gap-y-2 text-right">
                            <p>{Math.ceil(a)}</p>
                            <p>{Math.ceil(b)}</p>
                            <p>{Math.ceil(c)}</p>
                            <p></p>
                          </div>
                        </div>
                        <div className="mt-8 text-center mx-auto">
                          <button
                            onClick={() => {
                              sendEvent(blogs.Title, final);
                              router.push(
                                "../checkout/" +
                                  blogs.Slug +
                                  "?id=" +
                                  blogs.PID +
                                  "&startDate=" +
                                  encodeURIComponent(startDate) +
                                  "&endDate=" +
                                  encodeURIComponent(endDate) +
                                  "&adults=" +
                                  adult +
                                  "&child=" +
                                  children +
                                  "&type=" +
                                  blogs.Type +
                                  "&total=" +
                                  final
                              );
                            }}
                            className="bg-primary text-base-100 rounded-lg px-6 py-2"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-base-100 h-max text-center rounded-xl shadow-xl p-6 sticky top-4">
                <p className="text-2xl font-bold">
                  ₹ {blogs["Cost per Night"]}
                  <span className="text-sm font-normal">/night</span>
                </p>
                <p className="mt-4">
                  Maximum guests allowed are {blogs["Total Guests"]}
                </p>
                <p className="mt-4 text-lg font-bold">Ready to book?</p>
                <p className="mt-4">
                  Please contact the stay manager by clicking below for
                  availability and booking
                </p>
                <button
                  className="bg-primary text-base-100 rounded-lg px-6 py-2 mt-4"
                  onClick={() => setsContact(true)}
                >
                  Contact Stay Manager
                </button>
              </div>
            )}
          </div>
          {available !== 1 && (
            <div className=" text-center">
              {tg > 0 && tg <= blogs["Total Guests"] ? (
                <button
                  onClick={() => setCheck(1)}
                  className="mb-8 text-center mx-auto justify-center py-2 px-4 bg-primary text-base-100 rounded-lg"
                >
                  Check Availability
                </button>
              ) : null}
            </div>
          )}
          <SubmitManager
            open={showContact}
            from={setsContact}
            PID={blogs["PID"]}
            type={blogs["Type"]}
          />
        </div>
      </div>
    );
  }
}

export default checkoutModal;
