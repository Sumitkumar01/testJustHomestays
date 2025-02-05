import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { capitalCase } from "change-case";

export default function BCard(props) {
  const {
    booking: bookingId,
    from: startDate,
    to: endDate,
    adults,
    child,
    pid,
    ptype: type,
    amount,
    status,
  } = props;

  const [prop, setProp] = useState([]);
  const [arr, setArr] = useState([]);

  const router = useRouter();

  const options = useMemo(
    () => ({
      method: "GET",
      url: process.env.API_URL + (type === "JHS" ? "Property" : "StayVista"),
      params: {
        where: `(${type === "JHS" ? `ncRecordId,eq,${pid}` : `PID,eq,${pid}`})`,
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    }),
    [type, pid]
  );

  useEffect(() => {
    const getData = () => {
      axios.request(options).then(function (res) {
        setProp(res.data.list[0]);
        const source =
          type === "JHS"
            ? res.data.list[0].Images
            : JSON.parse(res.data.list[0].Images);
        const url =
          type === "JHS"
            ? "/api/process-image?imageUrl=https://test.justhomestay.in/"
            : "/api/process-image?imageUrl=";
        const imgs = source.map(
          (item) => url + (type === "JHS" ? item.path : item)
        );
        setArr(imgs);
      });
    };
    getData();
  }, [options]);

  if (prop) {
    return (
      <div className="grid grid-cols-3 bg-base-100 rounded-2xl drop-shadow-lg p-4 w-3/4 m-auto gap-x-4">
        <div className="grid col-span-1">
          <img src={arr[0]} className="aspect-[4/3] rounded-xl object-cover" />
        </div>
        <div className="grid col-span-2">
          <h2 className="text-2xl font-bold text-primary">{prop.Title}</h2>
          <p className="text-sm font-bold">
            {(prop?.Town ? capitalCase(prop.Town) : "") +
              ", " +
              (prop?.State ? capitalCase(prop.State) : "")}
          </p>
          <div className="grid grid-cols-2 mt-2">
            <div className="grid col-span-1">
              <p>Check in date</p>
              <p>Check out date</p>
              <p>Guests Count</p>
              <p>Amount Paid</p>
            </div>
            <div className="grid col-span-1 text-right font-semibold">
              <p>{startDate}</p>
              <p>{endDate}</p>
              <p>
                {adults} Adults{child ? <span> & {child} Children</span> : null}
              </p>
              <p>₹ {Number(amount)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 mt-2">
            <div className="grid col-span-1">
              <a
                onClick={() =>
                  router.push(
                    "/property/" +
                      prop.Slug +
                      "?type=" +
                      type +
                      "&rid=" +
                      prop.PID
                  )
                }
                className="underline hover:cursor-pointer text-primary font-bold"
              >
                Explore Property &gt;
              </a>
            </div>
            <div className="grid col-span-1 text-right">
              {status === "Booked" && new Date(startDate) > new Date() ? (
                <a href="#" className="underline text-error font-bold">
                  Cancel this booking &gt;
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
