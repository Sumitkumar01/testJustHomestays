import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useCookies } from "react-cookie";

function info() {
  const router = useRouter();
  const { quill, quillRef } = useQuill();
  const [data, setData] = useState();
  const [extraCostPerAdult, setExtraCostPerAdult] = useState();
  const [extraCostPerChild, setExtraCostPerChild] = useState();
  const [petsAllowed, setPetsAllowed] = useState();
  const [petFeePerNight, setPetFeePerNight] = useState();
  const [longStayWeeklyDiscount, setLongStayWeeklyDiscount] = useState();
  const [longStayMonthlyDiscount, setLongStayMonthlyDiscount] = useState();
  const [maximumBookingPeriod, setMaximumBookingPeriod] = useState();
  const [wifiAvailable, setWifiAvailable] = useState();
  const [wifiType, setWifiType] = useState();
  const [wifiSpeed, setWifiSpeed] = useState();
  const [checkInTime, setCheckInTime] = useState();
  const [checkOutTime, setCheckOutTime] = useState();
  const [additionalRules, setAdditionalRules] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();
  const [city, setCity] = useState();
  const [citynames, setCityNames] = useState([]);
  const [compressedDoc, setCompressedDoc] = useState("");
  const [menu, setMenu] = useState("");
  const [defaultCity, setdefaultCity] = useState();

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  }, []);

  const getData = (options) => {
    axios.request(options).then(function (res) {
      setData(res.data.list[0]);
      if (res.data.list[0].Location[0] && res.data.list[0].Location[0].Town) {
        setCity(res.data.list[0].Location[0].Town);
        setdefaultCity(res.data.list[0].Location[0].Town);
      } else {
        const options2 = {
          method: "GET",
          url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Location",
          params: { limit: 1000 },
          headers: {
            "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
          },
        };
        axios.request(options2).then(function (res) {
          setCityNames(res.data.list);
        });
      }
    });
  };

  useEffect(() => {
    if (quill) {
      quill.on("text-change", function () {
        setAdditionalRules(quill.root.innerHTML);
      });

      if (data && data["Additional Rules"]) {
        quill.clipboard.dangerouslyPasteHTML(data["Additional Rules"]);
      } else if (data && !data["Additional Rules"]) {
        quill.clipboard.dangerouslyPasteHTML("");
      } else {
        quill.clipboard.dangerouslyPasteHTML("No Data Available");
      }
    }
  }, [data]);

  const writetoDb = async () => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "PATCH",
      url: process.env.API_URL + "StayVista/" + id,
      headers: {
        "xc-token": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        "Extra Cost per Adult": JSON.parse(data["Price"]).extra_adult_price,
        "Extra Cost per Child": JSON.parse(data["Price"]).extra_child_price,
        "Pets Allowed": petsAllowed,
        "Pet Fee per Night": petFeePerNight,
        "Long Stay Weekly Discount": longStayWeeklyDiscount,
        "Long Stay Monthly Discount": longStayMonthlyDiscount,
        "Maximum Booking Period": maximumBookingPeriod,
        "Wifi Available": wifiAvailable,
        "WiFi Type": wifiType,
        "WiFi Speed (mbps)": wifiSpeed,
        "Checkin Time": checkInTime,
        "Checkout Time": checkOutTime,
        "Additional Rules": additionalRules,
        menuLink: menu,
      },
    };
    const response = await axios.request(options);
    if (citynames && !defaultCity) {
      const options2 = {
        method: "POST",
        url: process.env.API_URL + "StayVista/" + id + "/mm/Location/" + city,
        headers: {
          "xc-token": process.env.API_KEY,
        },
      };
      const res = await axios.request(options2);
      if (res.status === 200) {
        alert("City Updated");
      }
    }
    if (response.status === 200) {
      alert("Info Updated");
    }
  };

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista",
      params: { where: "(PID,eq," + id + ")" },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    getData(options);
  }, []);

  const logOutHandler = () => {
    deleteCookie("isAdminLoggedIn");
    router.push("/management/login");
  };

  if (isLoggedIn) {
    if (data) {
      return (
        <>
          <div className="w-full m-6 flex items-start justify-start gap-4">
            <p>
              <button
                className="bg-[#3F85F4] text-white py-2 px-4 rounded-md "
                onClick={() => router.push(`./stayVista`)}
              >
                Go Back
              </button>
            </p>
            <p>
              <button
                className="bg-primary text-white py-2 px-4 rounded-md "
                onClick={() => writetoDb()}
              >
                Save
              </button>
            </p>
            <p>
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-lg"
                onClick={logOutHandler}
              >
                Logout
              </button>
            </p>
          </div>
          <div className="m-6 border-4 border-green-600 rounded-lg">
            <div className="grid grid-cols-2">
              <div className="col-span-1">
                <div className="grid grid-cols-6">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Location
                  </p>
                  {city ? (
                    <p className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2">
                      {city}
                    </p>
                  ) : (
                    <select
                      onChange={(e) => setCity(e.target.value)}
                      defaultValue="city"
                      className="col-span-4 select select-bordered border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    >
                      <option disabled value="city">
                        Select City
                      </option>
                      {citynames.map((item, index) => {
                        return (
                          <option key={index} value={item.ncRecordId}>
                            {item.Town}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Cost Per Night
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={Number(data["Cost per Night"])}
                    readOnly
                    disabled
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Extra Cost Per Adult
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={
                      data["Extra Cost per Adult"]
                        ? data["Extra Cost per Adult"]
                        : JSON.parse(data["Price"]).extra_adult_price
                    }
                    disabled
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Extra Cost Per Child
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={
                      data["Extra Cost per Child"]
                        ? data["Extra Cost per Child"]
                        : JSON.parse(data["Price"]).extra_child_price
                    }
                    disabled
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Pets Allowed
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      defaultChecked={data["Pets Allowed"]}
                      onChange={(e) => setPetsAllowed(e.target.checked)}
                      type="checkbox"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Pet Fee Per Night
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Pet Fee per Night"]}
                    onChange={(e) => setPetFeePerNight(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Long Stay Weekly Discount
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Long Stay Weekly Discount"] * 100}
                    onChange={(e) =>
                      setLongStayWeeklyDiscount(e.target.value / 100)
                    }
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Long Stay Monthly Discount
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Long Stay Monthly Discount"] * 100}
                    onChange={(e) =>
                      setLongStayMonthlyDiscount(e.target.value / 100)
                    }
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Minimum Booking Period
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={Number(data["Minimum Booking Period"])}
                    readOnly
                    disabled
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Maximum Booking Period
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Maximum Booking Period"]}
                    onChange={(e) => setMaximumBookingPeriod(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Wifi Available
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      defaultChecked={data["Wifi Available"]}
                      onChange={(e) => setWifiAvailable(e.target.checked)}
                      type="checkbox"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Latitude
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={Number(data["Latitude"])}
                    readOnly
                    disabled
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Longitude
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={Number(data["Longitude"])}
                    readOnly
                    disabled
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Wifi Type
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["WiFi Type"]}
                    onChange={(e) => setWifiType(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Wifi Speed
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["WiFi Speed (mbps)"]}
                    onChange={(e) => setWifiSpeed(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Check In Time
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Checkin Time"]}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Check Out Time
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Checkout Time"]}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    type="number"
                  ></input>
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Instant Booking
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      defaultChecked={
                        data["Instant Booking"] === "1" ? true : false
                      }
                      readOnly
                      disabled
                      type="checkbox"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Slug
                  </p>
                  <input
                    className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                    defaultValue={data["Slug"]}
                    readOnly
                    disabled
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Additional Rules
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <div style={{ width: "100%", height: "auto" }}>
                      <div ref={quillRef} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-6">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Food Menu Link
                  </p>
                  <div className="col-span-4 border-b-2 border-solid border-green-600 w-full px-4 py-2">
                    <input
                      type="text"
                      className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                      defaultValue={data["menuLink"]}
                      onChange={(e) => setMenu(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-1 border-l-2  border-solid border-green-600 px-2 py-1">
                <div className="grid grid-cols-1 ">
                  <p>{data.City}</p>
                  <p>{data.State}</p>
                  {JSON.parse(data["Faq"]).map((q) => {
                    return (
                      <div className="col-span-1" key={q.id}>
                        <p className="py-2">{q.question + ": " + q.answer}</p>
                      </div>
                    );
                  })}
                  <img src={JSON.parse(data["HouseRules"])} />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  } else {
    return (
      <>
        <div className="w-full h-[100vh] ">
          <div className="flex flex-col  justify-center items-center mx-auto w-[30%] mt-[10%]">
            <h1 className="font-semibold text-2xl py-10">
              To get access login first
            </h1>
            <a href="/management/login">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Login First
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }
}

export default info;
