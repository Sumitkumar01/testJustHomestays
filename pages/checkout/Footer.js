import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import format from "date-fns/format";
import { useRouter } from "next/router";
import axios from "axios";

export default function Base(props) {
  const mobile = props.UID;
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [uid, setUid] = useState("");
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");
  const [propID, setPropid] = useState("");
  const [adult, setAdult] = useState("");
  const [child, setChild] = useState("");
  const [exist, setExist] = useState(false);
  const [bid, setBid] = useState("");
  const final = props.final;
  const router = useRouter();

  const bookingID = nanoid();
  var myHeaders = new Headers();
  var myHeaders2 = new Headers();
  myHeaders.append("Authorization", "Bearer keyqr8i1QluuOLwTR");
  myHeaders2.append("Authorization", "Bearer keyqr8i1QluuOLwTR");
  myHeaders2.append("Content-Type", "application/json");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const makePayment = async (userID) => {

    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    // Make API call to the serverless API
    const data = await fetch("/api/razorpay?amount=" + final, {
      method: "GET",
    })
      .then((t) => t.json())
      .catch((err) => console.log(err));
    var options = {
      key: "rzp_test_F1usjsmBHLxYwv", // Enter the Key ID generated from the Dashboard
      name: "JustHomeStay",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Thankyou for your test donation",
      image:
        "https://ik.imagekit.io/poghmpjirks/Just_Home_Stay/Icon_400X400_a4x-m07Ro.png?updatedAt=1681388857205",
      handler: function (response) {
        // Validate payment at server - using webhooks is a better idea.
        createBooking(response.razorpay_payment_id, userID);
      },
      prefill: {
        name: name,
        email: email,
        contact: mobile,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  function handleChange(e) {
    if (exist == true) {
      makePayment(uid);
    } else {
      createUser();
    }
  }



  async function createUser() {
    if (name) {
      if (email) {
        if (city) {
          const options = {
            method: "POST",
            url: process.env.API_URL + "Users",
            headers: {
              "xc-token": process.env.API_KEY,
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            data: {
              Mobile: Number(mobile),
              Name: name,
              EmailID: email,
              City: city,
              Active: true,
            },
          };
          const response = await axios.request(options);
          if (response.status === 200) {
            setUid(response.data.ncRecordId);
            makePayment(response.data.ncRecordId);
          }
        } else {
          alert("Enter your city.");
        }
      } else {
        alert("Enter your email");
      }
    } else {
      alert("Enter your name.");
    }

  
  }
  async function createBooking(paymentID, Uid) {
    const options = {
      method: "POST",
      url: process.env.API_URL + "Bookings",
      headers: {
        "xc-token": process.env.API_KEY,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      data: {
        "Booking ID": bookingID,
        From: startDate.toString(),
        To: endDate.toString(),
        Type: props.type,
        PID: Number(propID),
        User: [Uid],
        Status: "Booked",
        Payment: true,
        "Payment ID": paymentID,
        Adults: Number(adult),
        Children: Number(child),
        "Amount Paid": Number(final),
        Mobile: mobile,
      },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      const addPos = await axios.post(
        `${process.env.API_URL}Bookings/${response.data.Id}/mm/User/${Uid}`,
        {},
        {
          headers: {
            "xc-token": `${process.env.API_KEY}`,
          },
        }
      );
      setBid(response.data.Id);
    }
  }

  async function checkUser() {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Users",
      params: { where: "(Mobile,eq," + mobile + ")" },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    const response = await axios.request(options);
    if (response.data.list.length !== 0) {
      setUser(response.data.list[0]);
      setName(response.data.list[0].Name);
      setEmail(response.data.list[0].EmailID);
      setCity(response.data.list[0].City);
      setUid(response?.data.list[0].ncRecordId);
      setExist(true);
    } else {
      setUser([]);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStart(format(new Date(params.get("startDate")), "yyyy-MM-dd"));
    setEnd(format(new Date(params.get("endDate")), "yyyy-MM-dd"));
    setAdult(Number(params.get("adults")));
    setChild(Number(params.get("child")));
    setPropid(params.get("id"));
    checkUser();
  }, []);

  if (bid) {
    router.push("/checkout/thankyou?id=" + bid);
  }

  return (
    <div>
      <div className="my-4 justify-center flex flex-col  items-center">
        {user ? (
          <h1 className="font-bold md:text-2xl text-xl">
            Please confirm these details
          </h1>
        ) : (
          <h1 className="font-bold md:text-2xl text-xl">
            Just need few more details
          </h1>
        )}
        <div className="flex justify-center my-4 items-center gap-4 flex-col lg:flex-row w-full">
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Full Name*"
            className="rounded-xl px-6 py-4 md:w-1/2 w-full outline-slate-300 bg-base-200"
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            id="email"
            value={email}
            placeholder="Email ID*"
            className="rounded-xl px-6 py-4 md:w-1/2 w-full outline-slate-300 bg-base-200"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="text"
            id="city"
            value={city}
            placeholder="Residence City*"
            className="rounded-xl px-6 py-4 md:w-1/2 w-full outline-slate-300 bg-base-200"
            onChange={(event) => setCity(event.target.value)}
          />
        </div>

        <div>
          <button
            onClick={(event) => handleChange(event)}
            className="bg-primary text-base-100 px-4 py-2 rounded-lg"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
