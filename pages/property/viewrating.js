import axios from "axios";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

export default function Rating({ type, pid, card }) {
  const [average, setAverageRating] = useState(null);

  useEffect(() => {
    if (pid && type) {
      getReviews();
    }
  }, [pid, type]);

  const getReviews = async () => {
    const options = {
      method: "GET",
      url: `${process.env.API_URL}PropertyReview`,
      params: {
        where: `(PID,eq,${pid})~and(Type,eq,${type})`,
        fields: "Id,Rating",
        limit: 1000,
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    try {
      const res = await axios(options);
      if (res.status === 200) {
        const reviews = res.data.list;
        const totalRatings = reviews.length;
        if (totalRatings > 0) {
          const sumRatings = reviews.reduce(
            (acc, review) => acc + review.Rating,
            0
          );
          const avgRating = sumRatings / totalRatings;
          setAverageRating(avgRating);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (average > 0)
    return (
      <div className={`flex gap-x-1 my-auto ${card ? `mt-0` : `mt-2`}`}>
        <FaStar
          className={`${card ? `text-md` : `text-lg`} my-auto text-secondary`}
        />
        <p className={`${card ? `text-sm` : `text-base`}`}>
          {average.toFixed(1)}
        </p>
      </div>
    );
}
