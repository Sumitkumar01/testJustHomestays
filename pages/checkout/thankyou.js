import Header from "../header";
import Footer from "../Footer.jsx";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TY() {
  var id = "";
  var myHeaders = new Headers();
  var sec = "";
  const router = useRouter();
  const [booking, setBooking] = useState([]);
  const [propID, setPropid] = useState("");
  const [propType, setProptype] = useState("");
  const [prop, setProp] = useState([]);
  const [image, setImage] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    id = params.get("id");
    getBooking();
    if (propID) {
      getProperty();
      if (prop.length != 0 && propType == "SV") {
        setImage(JSON.parse(prop.Images)[0]);
      }
    }
  }, [propID, prop]);


  async function getBooking() {
    if (id) {
      const options = {
        method: "GET",
        url: process.env.API_URL + "Bookings/" + id,
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };
      const response = await axios.request(options);
      if (response.data.length !== 0) {
       setBooking(response.data);
          setPropid(response.data.PID);
          setProptype(response.data.Type);
      }
    }
   
  }

  async function getProperty() {
    if (propType == "JHS" ) {
     
      const options = {
        method: "GET",
        url: process.env.API_URL + "Property/" +Number(propID),
        headers: {
          "xc-token": process.env.API_KEY,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      };
      const response = await axios.request(options);
      if (response.data.length !== 0) {
      setProp(response.data);
      }
      // const options = {
      //   method: "GET",
      //   url: process.env.API_URL + "Property/"+Number(propID),
      //   headers: {
      //     "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      //   },
      // };
      // const response = await axios.request(options);
      // if (response.data.length !== 0) {
      //   setProp(response.data);

      // }

    } else {
      if (propID) {
        const options = {
          method: "GET",
          url: process.env.API_URL + "StayVista/"+Number(propID),
          headers: {
            "xc-token": process.env.API_KEY,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        };
        const response = await axios.request(options);
        if (response.data.length !== 0) {
        setProp(response.data);
        }
      }
     
 
    }
    setImages();
  }

  function setImages() {
    if (propType == "JHS" && prop["Images"]) {
      setImage(`https://test.justhomestay.in/${prop["Images"][0].path}`);
    }
  }

 
  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full md:px-0 px-4">
        <Header />
        <div className="gap-y-2">
          <h1 className="text-3xl text-center font-bold text-primary">
            Thank You
          </h1>
          <h2 className="text-xl text-center mt-4">
            Your booking is confirmed with
          </h2>
          <a href="/">
            <h2 className="text-xl text-center underline underline-offset-4">
              Just Home Stay
            </h2>
          </a>
        </div>
        <div className="my-12 m-auto">
          <div className="bg-base-100 rounded-2xl drop-shadow-lg md:w-3/4 w-full p-4 m-auto">
            <h3 className="text-2xl font-bold text-center">Booking Details</h3>
            <div className="grid md:grid-cols-3 grid-cols-1 mt-8 md:gap-x-4">
              <div className="grid col-span-1">
                <img
                  src={image}
                  className="aspect-square object-cover rounded-xl w-full"
                />
              </div>
              <div className="grid col-span-2">
                <p className="text-xl font-bold text-primary">
                  {prop["Title"]}
                </p>
                <p className="text-sm font-bold">Manali, Himachal Pradesh</p>
                <div className="grid md:grid-cols-2 grid-cols-3 mt-4">
                  <div className="grid col-span-1">
                    <p>Booking ID</p>
                    <p>Check in date</p>
                    <p>Check out date</p>
                    <p>Guests</p>
                    <p>Amount paid</p>
                  </div>
                  <div className="grid md:col-span-1 col-span-2 text-right">
                    <p>{booking["Booking ID"]}</p>
                    <p>{booking["From"]}</p>
                    <p>{booking["To"]}</p>
                    <p>
                      {booking["Adults"]} Adults
                      {booking["Children"] ? (
                        <span> & {booking["Children"]} Children</span>
                      ) : null}
                    </p>
                    <p>₹ {booking["Amount Paid"]}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-4">
                  <div className="grid col-span-1 text-left">
                    <button
                      onClick={() => router.push("/user/login")}
                      className="btn btn-md bg-primary text-base-100 hover:bg-base-100 hover:text-primary outline hover:outline-2"
                    >
                      Manage Booking
                    </button>
                  </div>
                  <div className="grid col-span-1">
                    <button className="btn btn-md bg-base-100 outline outline-2 outline-primary text-primary hover:text-base-100">
                      Have Questions?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
