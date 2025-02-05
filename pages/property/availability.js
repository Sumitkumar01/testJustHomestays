import { useState, useEffect, useContext } from "react";
import { format, isValid } from "date-fns";
import { MultiplierContext } from "../../contexts/MultiplierContext";

export default function Availability(props) {
  const [parameter, setParameter] = useState("");
  const [available, setAvailable] = useState(null);
  const startDate = props.sDate;
  const endDate = props.eDate;
  const ptype = props.ptype;
  const multiplier = useContext(MultiplierContext);

  const formatDate = (dateString, formatString) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatString) : null;
  };

  const [cpn, setCpn] = useState();
  const [night, setNight] = useState();
  const [total, setTotal] = useState();

  const adult = props.adult;
  const child = props.child;
  const propid = props.pid;

  const startYear = formatDate(startDate, "yyyy");
  const startMonth = formatDate(startDate, "MM");
  const startDay = formatDate(startDate, "dd");
  const endYear = formatDate(endDate, "yyyy");
  const endMonth = formatDate(endDate, "MM");
  const endDay = formatDate(endDate, "dd");

  useEffect(() => {
    if (available === null) {
      if (ptype === "JHS") {
        getAvailability();
      } else if (ptype === "SV") {
        getStayvista();
      }
    } else {
      if (ptype === "JHS") {
        props.avail(available);
      } else if (ptype === "SV") {
        props.avail(available);
        props.cpn(cpn);
        props.nights(night);
        props.total(total);
      }
    }
  }, [available]);

  function isDateWithinRange(date, rangeStart, rangeEnd) {
    return date >= rangeStart && date <= rangeEnd;
  }

  const getAvailability = async () => {
    fetch(`/api/bookedDates?id=${props.pid}`)
      .then((response) => response.json())
      .then((data) => {
        // Check if startDate and endDate fall on booked dates

        const bookedDates = data.bookedDates.map((date) => new Date(date));

        const isAvailable = !bookedDates.some((date) =>
          isDateWithinRange(date, startDate, endDate)
        );

        setParameter(isAvailable ? 1 : 0);
      })
      .catch((error) => {
        console.error("Failed to fetch booked dates", error);
        setAvailable(0); // Assume not available on error
      });
  };

  const getStayvista = async () => {
    const response = await fetch(
      `https://api.vistarooms.com/api/v2/inventory-price?checkInDate=${startYear}-${startMonth}-${startDay}&checkOutDate=${endYear}-${endMonth}-${endDay}&propertyId=${propid}&adult=${adult}&child=${child}`,
      {
        headers: {
          apiKey: "45CF5-15516",
          secretKey: "0b202f12835710c65165de4021ae65cbdfa577b3",
        },
      }
    );
    const myJson = await response.json();
    setParameter(myJson.response.booking_status);
    setCpn(
      (myJson.response.price * multiplier) /
        (myJson.response.date_diff_in_days * 1.18)
    );
    setTotal((myJson.response.price * multiplier) / 1.18);
    setNight(myJson.response.date_diff_in_days);
  };

  useEffect(() => {
    if (parameter !== "") {
      if (ptype === "JHS") {
        if (parameter === 1) {
          setAvailable(1);
        } else if (parameter === 0) {
          setAvailable(0);
        } else {
          getAvailability();
        }
      } else if (ptype === "SV") {
        if (parameter === 1) {
          setAvailable(1);
        } else if (parameter === 0) {
          setAvailable(0);
        } else {
          getStayvista();
        }
      }
    }
  }, [parameter]);
}
