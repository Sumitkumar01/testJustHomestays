import { useState, useEffect } from "react";
import DCard from "./discountcard";
import { format, differenceInDays } from "date-fns";

export default function Card(props) {
  const [discount, setDiscount] = useState("");
  var discVal = 0;
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [adult, setAdult] = useState("");
  const [child, setChild] = useState("");
  const [discname, setDiscname] = useState("");
  const [night, setNight] = useState("");
  var total = 0;
  var gst = 0;
  var final = 0;
  var extraA = 0;
  var extraC = 0;
  var extraCost = 0;

  if (adult > 0) {
    var tg = adult + child;
    if (tg > props.allowG) {
      if (adult > props.allowG && !child) {
        extraA = tg - props.allowG;
        extraC = 0;
      } else if ((adult > props.allowG) & (child > 0)) {
        extraA = adult - props.allowG;
        extraC = tg - adult;
      } else {
        extraA = 0;
        extraC = tg - props.allowG;
      }
    }
  }

  if (extraA > 0 && extraC > 0) {
    extraCost = extraA * props.extraAdult + extraC * props.extraChild;
  } else if (extraA > 0 && extraC == 0) {
    extraCost = extraA * props.extraAdult;
  } else if (extraA == 0 && extraC > 0) {
    extraCost = extraC * props.extraChild;
  } else {
    extraCost = 0;
  }

  if (night > 0) {
    if (extraCost == 0) {
      total = Number(props.total);
    } else {
      total = Number(extraCost) * Number(night) + Number(props.total);
    }
  } else {
    total = 0;
  }

  if (discount > 0) {
    discVal = Math.round((discount * total) / 100);
  } else {
    discVal = 0;
  }

  if (total > 0) {
    var t = Number(total) - Number(discVal);
    gst = Math.round(t * 0.18, 0);
  } else {
    gst = 0;
  }

  if (gst > 0) {
    final = Number(total) - Number(discVal) + Number(gst);
  } else {
    final = 0;
  }

  if (final) {
    props.final(Number(final));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStart(format(new Date(params.get("startDate")), "dd-MM-yyyy"));
    setEnd(format(new Date(params.get("endDate")), "dd-MM-yyyy"));
    setAdult(Number(params.get("adults")));
    setChild(Number(params.get("child")));
    setNight(
      differenceInDays(
        new Date(params.get("endDate")),
        new Date(params.get("startDate"))
      )
    );
  }, []);

  return (
    <>
      <div className="text-left py-4 rounded-xl bg-base-100 drop-shadow-lg">
        <div className="border-b-2 border-secondary md:mx-8 mx-4 py-4 drop-shadow-xl">
          {/* Checkin Details  */}
          <div className="grid grid-cols-2">
            <div className="grid col-span-1 font-bold">
              <h1>Check-in</h1>
              <h1>Check-out</h1>
              <h1>Guests</h1>
            </div>
            <div className="grid col-span-1 my-2 text-right">
              <h1>{start}</h1>
              <h1>{end}</h1>
              <h1>
                {adult} Adults{child ? <span> & {child} Children</span> : null}
              </h1>
            </div>
          </div>
        </div>
        {/* Discount  */}
        <div className="md:mx-8 mx-4 border-b-2 border-secondary   ">
          <div className="grid my-2 grid-cols-1 ">
            <h1 className="text-2xl my-4 font-bold">Apply Discount/Offer</h1>
            <input
              type="text"
              placeholder="Discount Code"
              value={discname}
              className="rounded-xl px-2 py-4 outline-slate-200 bg-slate-100"
            />

            {/* Coupons */}
            {props.discount ? (
              <div>
                {props.discount.map((disc, index) => (
                  <DCard
                    discount={disc}
                    key={index}
                    nights={night}
                    selected={setDiscount}
                    name={setDiscname}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {/* Charges  */}
        <div className="border-b-2 border-secondary md:mx-8 mx-4 py-4">
          <div className="grid grid-cols-2">
            <div className="grid col-span-1 font-bold">
              <h1>Room Charges</h1>
              <h1>Discount</h1>
              <h1>Convenience Fee</h1>
              <h1>GST (as applicable)</h1>
            </div>
            <div className="grid col-span-1 my-2 text-right">
              <h1>
                <span>+</span>
                <span>₹ {props.total}</span>
              </h1>
              <h1>
                <span>-</span>
                <span>₹ {discVal}</span>
              </h1>
              <h1>
                <span>+</span>
                <span>₹ 0</span>
              </h1>
              <h1>
                <span>+</span>
                <span>₹ {gst}</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="py-2 md:mx-8 mx-4">
          <div className="grid grid-cols-2 text-3xl font-semibold text-green-800 ">
            <h1 className=" col-span-1">TOTAL</h1>
            <h1 className="col-span-1 text-right">₹ {final}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
