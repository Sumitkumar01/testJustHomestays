import RCard from "./reviewcard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function VReview({ type, pid }) {
  const [review, setReview] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // console.log(type, pid);
    getReviews(pid, type);
  }, []);

  const getReviews = async (rid, typ) => {
    const options = {
      method: "GET",
      url: `${process.env.API_URL}PropertyReview`,
      params: {
        where: `(PID,eq,${rid})~and(Type,eq,${typ})`,
        fields: "CreatedAt,Id,Name,Rating,Rating Text,ReviewDate",
        limit: 9,
        sort: "-CreatedAt",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    try {
      const res = await axios(options);
      if (res.data.list.length > 0) {
        setReview(res.data.list);
      } else {
        setReview([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (review.length === 0) {
    return <p className="mt-2 mb-2">No Reviews Yet!</p>;
  } else {
    return (
      <div className="flex lg:flex gap-4 flex-wrap py-4">
        {review.map((rev) => (
          <div key={rev.Id}>
            <RCard
              date={rev["ReviewDate"] ? rev["ReviewDate"] : rev["CreatedAt"]}
              name={rev["Name"]}
              rating={rev["Rating"]}
              text={rev["Rating Text"]}
            />
          </div>
        ))}
      </div>
    );
  }
}
