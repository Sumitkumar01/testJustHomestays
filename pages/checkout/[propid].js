import Popup from "./popup";
import { useEffect, useState } from "react";
import Card from "./card";
import Header from "../header";
import Base from "./Footer.jsx";
import { useRouter } from "next/router";
import ACard from "../property/amenitygrid";
import axios from "axios";
import { capitalCase } from "change-case";
import Footer from "../Footer.jsx";

export default function Checkout() {
  const [popup, setPopup] = useState(false);
  const [uid, setUid] = useState("");
  const [prop, setProp] = useState([]);
  const [final, setFinal] = useState("");
  const [ptype, setPtype] = useState("");
  const [itotal, setItotal] = useState(null);
  var id = "";
  var type = "";
  var options = [];
  const router = useRouter();

  useEffect(() => {
    setPopup(true);
    const params = new URLSearchParams(window.location.search);
    id = params.get("id");
    type = params.get("type");
    setPtype(params.get("type"));

    setItotal(params.get("total"));
    options = {
      method: "GET",
      url: process.env.API_URL + (type === "JHS" ? "Property" : "StayVista"),
      params: {
        where: "(PID,eq," + id + ")",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    getData(options);
  }, []);

  const getData = async (options) => {
    const temp = await axios.request(options);
    setProp(temp.data.list[0]);
    setPtype(temp.data.list[0].Type);
  };

  if (prop)
    return (
      <div className="flex justify-center">
        <div className="lg:w-[1140px] w-full md:px-0 px-4">
          <Header />
          <div className="grid lg:grid-cols-5 md:gap-8">
            <div className="grid md:col-span-3 border-b-2 border-secondary my-4 text-left">
              <div className="my-4">
                <h1 className="md:text-3xl text-2xl font-semibold">
                  {prop.Title}
                </h1>
                {prop.Town ? (
                  <p className="text-base text-slate-700 mt-2">
                    {capitalCase(prop.Town) + ", " + capitalCase(prop.State)}
                  </p>
                ) : (
                  <></>
                )}
                <div className="seperator mt-4" />
                <p className="mt-2">
                  {prop["Number of Bedrooms"]} bedrooms
                  <span className="text-xl font-bold"> · </span>
                  {prop["Number of Bathrooms"]} bathrooms
                  <span className="text-xl font-bold"> · </span>
                  {prop["Total Guests"]} guests
                </p>

                <p className="mt-4 mb-6">{prop["Short Description"]}</p>
                <p className="mt-4 text-lg font-bold">Top Amenities</p>
                {prop.Amenity ? (
                  <div className="grid grid-cols-3 gap-4 mt-4 mb-6">
                    {prop["Amenity"].slice(0, 6).map((amenity, index) => (
                      <div key={index} className="grid col-span-1">
                        <ACard id={amenity.ncRecordId} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}

                <button
                  onClick={() => router.push("/property/" + prop.Slug)}
                  className="font-bold text-primary underline cursor-pointer"
                >
                  More about {prop.Title} &gt;
                </button>
              </div>
            </div>
            <div className="grid my-4 md:col-span-2">
              {prop ? (
                <Card
                  discount={prop["UID (from Discount)"]}
                  cost={Number(prop["Cost per Night"])}
                  extraAdult={Number(prop["Extra Cost per Adult"])}
                  extraChild={Number(prop["Extra Cost per Child"])}
                  totalG={prop["Total Guests"]}
                  allowG={prop["Guests Included"]}
                  final={setFinal}
                  total={itotal}
                />
              ) : null}
            </div>
          </div>
          {uid ? <Base UID={uid} type={ptype} final={final} /> : null}
          <Footer />
          <Popup open={popup} from={setPopup} mobile={setUid} />
        </div>
      </div>
    );
}
