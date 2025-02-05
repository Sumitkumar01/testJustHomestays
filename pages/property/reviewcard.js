import { format, parseISO } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { AiFillStar, AiFillCheckCircle } from "react-icons/ai";
import { useState } from "react";

export default function RCard({ date, name, rating, text }) {
  // Ensure the date is valid
  let formattedDate = "Invalid Date";
  try {
    formattedDate = date ? format(parseISO(date), "MMM, yyyy") : "N/A";
  } catch (error) {
    console.error("Invalid date format:", error);
  }

  const stars = Array.from({ length: Math.round(rating || 0) }, (_, index) => (
    <AiFillStar key={index} />
  ));

  const [more, setMore] = useState(false);

  return (
    <div className="bg-white text-neutral lg:h-full rounded-lg drop-shadow-lg p-4 min-w-[250px] md:max-w-[300px]">
      {rating ? <div className="flex">{stars}</div> : <Skeleton width={100} height={20} />}
      {text ? (
        <p>
          {text.length > 120 && !more ? `${text.slice(0, 120)}...` : text}
        </p>
      ) : (
        <Skeleton width={200} height={60} />
      )}
      {text && text.length > 120 && (
        <button
          onClick={() => setMore((prev) => !prev)}
          className="py-2 text-sm text-primary font-bold"
        >
          {more ? "Read Less" : "Read More"}
        </button>
      )}
      <div className="flex gap-x-4">
        <p className="text-sm font-bold mt-2">{name || <Skeleton width={100} />}</p>
        <p className="flex text-sm mt-2">
          <span className="self-center pr-1">
            <AiFillCheckCircle />
          </span>
          Booked with JHS
        </p>
      </div>
      <p className="text-xs font-bold">{formattedDate || <Skeleton width={50} />}</p>
    </div>
  );
}
