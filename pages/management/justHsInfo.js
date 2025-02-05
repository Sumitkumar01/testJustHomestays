import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useCookies } from "react-cookie";

const justHsInfo = () => {
  const router = useRouter();
  const { quill, quillRef } = useQuill();
  const [data, setData] = useState();
  const [costPerNight, setCostPerNight] = useState();
  const [extraCostPerAdult, setExtraCostPerAdult] = useState();
  const [extraCostPerChild, setExtraCostPerChild] = useState();
  const [petsAllowed, setPetsAllowed] = useState();
  const [petFeePerNight, setPetFeePerNight] = useState();
  const [longStayWeeklyDiscount, setLongStayWeeklyDiscount] = useState();
  const [longStayMonthlyDiscount, setLongStayMonthlyDiscount] = useState();
  const [maximumBookingPeriod, setMaximumBookingPeriod] = useState();
  const [minimumBookingPeriod, setMinimumBookingPeriod] = useState();
  const [wifiAvailable, setWifiAvailable] = useState();
  const [wifiType, setWifiType] = useState();
  const [wifiSpeed, setWifiSpeed] = useState();
  const [checkInTime, setCheckInTime] = useState();
  const [checkOutTime, setCheckOutTime] = useState();
  const [additionalRules, setAdditionalRules] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [instantBooking, setInstantBooking] = useState();
  const [slug, setSlug] = useState();
  const [title, setTitle] = useState();
  const [guestsIncluded, setGuestIncluded] = useState();
  const [extraGuests, setExtraGuests] = useState();
  const [numberOfBedrooms, setNumberOfBedrooms] = useState();
  const [numberOfBathrooms, setNumberOfBathrooms] = useState();
  const [listingStatus, setListingStatus] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();
  const [menu, setMenu] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  }, []);

  const handleDeleteImage = (e) => {
    if (compressedDoc.length > 0) {
      let arr1 = [];
      for (let i = 0; i < compressedDoc.length; i++) {
        const element = compressedDoc[i].path;
        if (element === e.target.id) {
          if (compressedDoc.length === 1) {
            setCompressedDoc([]);
          }
        } else {
          arr1.push(compressedDoc[i]);
          setCompressedDoc(arr1);
        }
      }
    }
  };

  const getData = (options) => {
    axios.request(options).then(function (res) {
      setData(res.data.list[0]);
      console.log(res.data.list[0]);
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
      url:
        "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property/" +
        id,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      data: {
        "Cost per Night": costPerNight,
        "Extra Cost per Adult": extraCostPerAdult,
        "Extra Cost per Child": extraCostPerChild,
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
        "Minimum Booking Period": minimumBookingPeriod,
        Latitude: latitude,
        Longitude: longitude,
        "Instant Booking": instantBooking,
        Slug: slug,
        Title: title,
        "Guests Included": guestsIncluded,
        "Extra Guests": extraGuests,
        "Number of Bedrooms": numberOfBedrooms,
        "Number of Bathrooms": numberOfBathrooms,
        "Listing Status": listingStatus,
        menuLink: menu,
      },
    };
    const response = await axios.request(options);
    console.log(response);
    if (response.status === 200) {
      alert("Info Updated");
    }
  };

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    console.log(id);
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
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

  const form = useRef();

  if (isLoggedIn) {
    if (data) {
      return (
        <>
          <div className="w-full m-6 flex items-start justify-start gap-4">
            <p>
              <button
                className="bg-[#3F85F4] text-white py-2 px-4 rounded-md "
                onClick={() => router.push(`./justHomeStay`)}
              >
                Go Back
              </button>
            </p>
            <p>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md "
                onClick={writetoDb}
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
                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Title
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Title"]}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Cost Per Night
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={Number(data["Cost per Night"])}
                    onChange={(e) => setCostPerNight(e.target.value)}
                    name="CostPerNight"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Extra Cost Per Adult
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Extra Cost per Adult"]}
                    onChange={(e) => setExtraCostPerAdult(e.target.value)}
                    name="ExtraCostPerAdult"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Extra Cost Per Child
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Extra Cost per Child"]}
                    onChange={(e) => setExtraCostPerChild(e.target.value)}
                    name="ExtraCostPerChild"
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
                      name="PetsAllowed"
                      type="checkbox"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Pet Fee Per Night
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Pet Fee per Night"]}
                    onChange={(e) => setPetFeePerNight(e.target.value)}
                    name="PetFeePerNight"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Long Stay Weekly Discount
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Long Stay Weekly Discount"] * 100}
                    onChange={(e) =>
                      setLongStayWeeklyDiscount(e.target.value / 100)
                    }
                    name="LongStayWeeklyDiscount"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Long Stay Monthly Discount
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Long Stay Monthly Discount"] * 100}
                    onChange={(e) =>
                      setLongStayMonthlyDiscount(e.target.value / 100)
                    }
                    name="LongStayMonthlyDiscount"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Minimum Booking Period
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={Number(data["Minimum Booking Period"])}
                    onChange={(e) => setMinimumBookingPeriod(e.target.value)}
                    name="MinimumBookingPeriod"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Maximum Booking Period
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Maximum Booking Period"]}
                    onChange={(e) => setMaximumBookingPeriod(e.target.value)}
                    name="MaximumBookingPeriod"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Latitude
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={Number(data["Latitude"])}
                    onChange={(e) => setLatitude(e.target.value)}
                    name="Latitude"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Longitude
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={Number(data["Longitude"])}
                    onChange={(e) => setLongitude(e.target.value)}
                    name="Longitude"
                    type="number"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Slug
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Slug"]}
                    onChange={(e) => setSlug(e.target.value)}
                    name="Slug"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Guests Included
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Guests Included"]}
                    onChange={(e) => setGuestIncluded(e.target.value)}
                    name="GuestsIncluded"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Extra Guests
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Extra Guests"]}
                    onChange={(e) => setExtraGuests(e.target.value)}
                    name="ExtraGuests"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Number Of Bedrooms
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Number of Bedrooms"]}
                    onChange={(e) => setNumberOfBedrooms(e.target.value)}
                    name="NameOfBedrooms"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className=" border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Number Of Bathrooms
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Number of Bathrooms"]}
                    onChange={(e) => setNumberOfBathrooms(e.target.value)}
                    name="NameOfBathrooms"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Listing Status
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      defaultChecked={data["Listing Status"]}
                      onChange={(e) => setListingStatus(e.target.checked)}
                      name="ListingStatus"
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Instant Booking
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      defaultChecked={data["Instant Booking"]}
                      onChange={(e) => setInstantBooking(e.target.checked)}
                      name="InstantBooking"
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Check In Time
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Checkin Time"]}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    name="CheckInTime"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Check Out Time
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["Checkout Time"]}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    name="CheckOutTime"
                    type="number"
                  ></input>
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Wifi Available
                  </p>
                  <div className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      defaultChecked={data["Wifi Available"]}
                      onChange={(e) => setWifiAvailable(e.target.checked)}
                      name="WifiAvailable"
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Wifi Type
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["WiFi Type"]}
                    onChange={(e) => setWifiType(e.target.value)}
                    name="WiFiType"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-6 ">
                  <p className="border-b-2 border-r-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Wifi Speed
                  </p>
                  <input
                    className="col-span-4 border-b-2  border-solid border-green-600 w-full px-4 py-2 bg-gray-300"
                    defaultValue={data["WiFi Speed (mbps)"]}
                    onChange={(e) => setWifiSpeed(e.target.value)}
                    name="WiFiSpeed"
                    type="number"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-12 ">
                  <p className="border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Additional Rules
                  </p>
                  <div className="col-span-10 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <div style={{ width: "100%", height: "auto" }}>
                      <div ref={quillRef} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-12 ">
                  <p className="border-b-2 border-r-2 border-l-2 border-solid border-green-600 w-full px-4 py-2 col-span-2">
                    Food Menu Link
                  </p>
                  <div className="col-span-10 border-b-2  border-solid border-green-600 w-full px-4 py-2">
                    <input
                      type="text"
                      className="col-span-4 border-b-2 bg-gray-300 border-solid border-green-600 w-full px-4 py-2"
                      defaultValue={data["menuLink"]}
                      onChange={(e) => setMenu(e.target.value)}
                    />
                  </div>
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
};

export default justHsInfo;
