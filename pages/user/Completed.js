import React, { useState, useEffect } from "react";
import BCard from "./bookingCard";
import NA from "./no";

function Completed(props) {
  const bookings = props.list;

  if (bookings && bookings.length > 0) {
    return (
      <div>
        {bookings.length == 1 ? (
          <BCard
            booking={bookings[0]["Booking ID"]}
            from={bookings[0]["From"]}
            to={bookings[0]["To"]}
            adults={bookings[0]["Adults"]}
            child={bookings[0]["Children"]}
            pid={bookings[0]["PID"]}
            ptype={bookings[0]["Type"]}
            amount={bookings[0]["Amount Paid"]}
            status={"Booked"}
          />
        ) : (
          <div className="gap-y-2">
            {bookings.map((booking, index) => (
              <div className="my-4" key={index}>
                <BCard
                  booking={booking["Booking ID"]}
                  from={booking["From"]}
                  to={booking["To"]}
                  adults={booking["Adults"]}
                  child={booking["Children"]}
                  pid={booking["PID"]}
                  ptype={booking["Type"]}
                  amount={booking["Amount Paid"]}
                  status={"Booked"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <>
        <NA />
      </>
    );
  }
}

export default Completed;
