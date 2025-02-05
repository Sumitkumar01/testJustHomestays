import { useEffect, useState } from "react";
import {
  BackIcon,
  Calender,
  NumberOfRoomsIcon,
  OutLinkLocation,
  TotalUserIcon,
} from "../util/icons";

const SearchByProperty = ({
  showSearchByProperty,
  setShowSearchByProperty,
}) => {
  const date = new Date();
  const currentDate = date.getUTCDate();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = monthNames[date.getUTCMonth()];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = dayNames[date.getUTCDay()];

  const currentYear = date.getUTCFullYear();

  const [checkIn, setCheckIn] = useState({
    date: currentDate,
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  });

  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);
  const [checkOut, setCheckOut] = useState({
    date: nextDate.getUTCDate(),
    month: monthNames[nextDate.getUTCMonth()],
    day: dayNames[nextDate.getUTCDay()],
    year: nextDate.getUTCFullYear(),
  });

  useEffect(() => {
    if (showSearchByProperty) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSearchByProperty]);



  const handleSearchProperty = () => {
    alert("jkl;")
  }
  return (
    <div
      className={`fixed z-30 px-4 w-full h-full top-0 left-0 md:hidden bg-white 
      transition-all duration-300 ease-in-out`}
    >
      <div
        className={`flex flex-col gap-2 bg-white overflow-hidden fixed top-0 left-0 w-full transition-all duration-300 ease-in-out ${showSearchByProperty
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-full"
          }`}
      >
        <div className="flex items-center gap-4 w-full px-4 pt-3 pb-[0.38rem]">
          <button
            className="w-fit flex mt-1 items-center justify-start border-none bg-transparent"
            onClick={() => setShowSearchByProperty(false)}
          >
            <BackIcon />
          </button>
          <h2 className="text-xl capitalize text-normal">
            Search your property
          </h2>
        </div>
        <div className="h-[1px] bg-stone-300 w-full"></div>
        <form className="grid grid-cols-2 gap-x-4  gap-y-5 px-4 mt-4">
          {/* Search by property */}
          <div className="w-full border border-light rounded-lg relative flex items-center gap-2 px-4 py-5 col-span-2">
            <span className="absolute -top-[0.12rem] bg-white left-4 transform translate-x-2/1 -translate-y-1/2 text-light text-sm">
              Search by property/location
            </span>
            <label htmlFor="Search your property">
              <OutLinkLocation />
            </label>
            <input
              type="text"
              id="Search your property"
              placeholder="Search your property"
              className="w-full text-sm placeholder:bg-white bg-white outline-none"
            />
          </div>
          {/* check-in and check-out */}
          <div className="w-full border border-light rounded-lg relative flex items-center gap-2 px-2 py-5">
            <span className="absolute -top-[0.12rem] bg-white left-4 transform translate-x-2/1 -translate-y-1/2 text-light text-sm">
              Check-In Date
            </span>
            <label htmlFor="Check-In Date">
              <Calender />
            </label>
            <input
              type="date"
              id="Check-In Date"
              placeholder="Check-In Date"
              className="text-sm placeholder:bg-white pointer-events-auto bg-white outline-none opacity-0"
            />
            <span className="absolute right-4 top-[1.4rem] pointer-events-none text-sm">
              <span className="font-semibold">
                {" "}
                {checkIn.date} {checkIn.month}{" "}
              </span>
              {checkIn.day} {checkIn.year}
            </span>
          </div>
          <div className="w-full border border-light rounded-lg relative flex items-center gap-2 px-2 py-5">
            <span className="absolute -top-[0.12rem] bg-white left-4 transform translate-x-2/1 -translate-y-1/2 text-light text-sm">
              Check-Out Date
            </span>
            <label htmlFor="Check-Out-Date">
              <Calender />
            </label>
            <input
              type="date"
              id="Check-Out-Date"
              placeholder="Check-Out Date"
              className="w-full  pointer-events-auto placeholder:bg-white opacity-0 bg-white outline-none"
            />
            <span className="absolute right-4 top-[1.4rem] pointer-events-none text-sm">
              <span className="font-semibold">
                {checkOut.date} {checkOut.month}{" "}
              </span>{" "}
              {checkOut.day} {checkOut.year}
            </span>
          </div>
          {/* total guest */}
          <div className="w-full border border-light rounded-lg relative flex items-center gap-2 px-4 py-5 col-span-2">
            <span className="absolute -top-[0.12rem] bg-white left-4 transform translate-x-2/1 -translate-y-1/2 text-light text-sm">
              Total Guests
            </span>
            <label htmlFor="Search your property">
              <TotalUserIcon />
            </label>
            <input
              type="text"
              id="Search your property"
              placeholder="2 Adults, 2 Children"
              className="w-full text-sm placeholder:bg-white bg-white outline-none"
            />
          </div>
          {/* number of rooms */}
          <div className="w-full border border-light rounded-lg relative flex items-center gap-2 px-4 py-5 col-span-2">
            <span className="absolute -top-[0.12rem] bg-white left-4 transform translate-x-2/1 -translate-y-1/2 text-light text-sm">
              Number of Rooms
            </span>
            <label htmlFor="rooms">
              <NumberOfRoomsIcon />
            </label>
            <input
              type="text"
              id="rooms"
              placeholder="2 Rooms"
              className="w-full text-sm placeholder:bg-white bg-white outline-none"
            />
          </div>
          <button onClick={handleSearchProperty} className="col-span-2 bg-dark py-4 text-white font-medium rounded-lg">
            Search Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchByProperty;
