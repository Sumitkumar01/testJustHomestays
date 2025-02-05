import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Rating from "react-rating";

export default function SReview(props) {
  const ptype = props.type;
  const id = props.id;
  const [cookies, setCookie] = useCookies(["isLoggedIn", "mobile"]);
  const userid = cookies.mobile;
  const router = useRouter();
  const [isBooking, setisBooking] = useState(0);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [reviewPresent, setreviewPresent] = useState(false);

  useEffect(() => {
    if (props.open) {
      checkBooking();
      checkReview();
      checkUser();
    }
  }, [props.open]);

  const checkUser = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Users",
      params: {
        where: `(Mobile,eq,${userid})`,
        fields: "Name",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    try {
      const res = await axios.request(options);
      setName(res.data.list[0].Name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const checkReview = async () => {
    const { rid, type } = router.query;
    const options = {
      method: "GET",
      url: process.env.API_URL + "PropertyReview",
      params: {
        where: `(PID,eq,${rid})~and(Type,eq,${type})~and(User Mobile,eq,${userid})`,
        fields: "Id",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    try {
      const res = await axios(options);
      if (res.data.list.length > 0) {
        setreviewPresent(true);
      } else null;
    } catch (error) {
      console.log(error);
    }
  };

  const checkBooking = async () => {
    const { rid, type } = router.query;
    if (!rid || !type || !userid) {
      console.error("Missing required parameters: pid, type, or mobile");
      return;
    }
    const pid = rid;
    const options = {
      method: "GET",
      url: process.env.API_URL + "Bookings",
      params: {
        where: `(PID,eq,${pid})~and(Type,eq,${type})~and(Mobile,eq,${userid})`,
        fields: "Booking ID",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    try {
      const res = await axios(options);
      setisBooking(res.data.list.length);
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    const { rid, type } = router.query;
    const schema = {
      Name: name,
      "User Mobile": userid,
      Rating: rating,
      "Rating Text": text,
      PID: rid,
      Type: type,
    };
    console.log(schema);
    const options = {
      method: "POST",
      url: `${process.env.API_URL}PropertyReview`,
      headers: {
        "Content-Type": "application/json",
        "xc-token": process.env.API_KEY,
      },
      data: schema,
    };
    try {
      const response = await axios(options);
      console.log("Review submitted successfully", response.data);
      // Here you can add more logic after successful submission, like showing a confirmation message
    } catch (error) {
      console.error("Error submitting the review", error);
    }
  };

  if (props.open) {
    return (
      <div className="backdrop justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="modal-box m-auto md:p-4 p-2 text-right h-max">
          <h4 className="text-xl font-bold text-center">Submit Review</h4>
          {isBooking === 0 && !reviewPresent ? (
            <p className="mt-4 text-center font-bold">No bookings found!</p>
          ) : null}
          {isBooking > 0 && !reviewPresent ? (
            <div className="text-center w-full pt-4">
              <p>Thank your for staying with us!</p>
              <p>Please submit your feedback</p>
              <div className="py-4 grid gap-4 justify-center">
                <input
                  type="text"
                  placeholder="Please enter your name"
                  className="input input-bordered w-full"
                  value={name}
                  readOnly={name !== ""}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="flex gap-x-4">
                  <p>Rate your experience</p>
                  <Rating
                    start={0}
                    stop={5}
                    fractions={1}
                    initialRating={rating}
                    onChange={handleRatingChange}
                  />
                </div>
                <textarea
                  className="textarea textarea-bordered text-lg"
                  placeholder="Few words of wisdom..."
                  onChange={(e) => setText(e.target.value)}
                >
                  {text}
                </textarea>
                <button
                  onClick={() => submitReview()}
                  className="btn btn-primary"
                >
                  Submit Review
                </button>
              </div>
            </div>
          ) : null}
          {isBooking > 0 && reviewPresent ? (
            <p className="mt-4 text-center font-bold">
              Already reviewed, thank you for your submission
            </p>
          ) : null}
          {isBooking === 0 && !reviewPresent ? (
            <div className="w-full text-center">
              <button
                className="btn btn-primary px-4 py-2 w-max mt-4 text-center justify-center"
                onClick={() => props.from(false)}
              >
                Make a booking now!
              </button>
            </div>
          ) : null}
          {isBooking > 0 && !reviewPresent ? (
            <button
              className="btn btn-link text-center w-full justify-center"
              onClick={() => props.from(false)}
            >
              No, thank you!
            </button>
          ) : (
            <button
              className="btn btn-link text-center w-full justify-center"
              onClick={() => props.from(false)}
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }
}
