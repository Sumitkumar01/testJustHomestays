import ACard from "./amenityCard";
import { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import AAmenities from "./allAmenities";
import { useRouter } from "next/router";
import axios from "axios";
import { filter } from "lodash";

export default function SAmenities() {
  const [amen, setAmen] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const options = {
    method: "GET",
    url: process.env.API_URL + "Amenities/",
    params: { limit: "100", where: "" },
    headers: {
      "xc-token": process.env.API_KEY,
    },
  };

  const getData = () => {
    axios.request(options).then(function (res) {
      setAmen(res.data.list);
    });
  };

  useEffect(() => {
    getData();
  }, []);
  if (amen) {
    const featuredAmen = filter(amen, { Featured: true });
    return (
      <div className="mt-6 justify-center mx-auto px-4">
        <div className="grid md:grid-cols-8 grid-cols-2 md:gap-2 gap-4">
          {featuredAmen.slice(0, 8).map((lc, index) => (
            <a
              className="cursor-pointer"
              key={index}
              onClick={() => router.push("/all-properties?id=" + lc.ID)}
            >
              <ACard icon={lc.Icon[0]} amenity={lc.Name} />
            </a>
          ))}
        </div>
        <a className="cursor-pointer" onClick={() => setOpen(true)}>
          <div className="mx-auto w-max mt-8">
            <div className="grid grid-cols-5 px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary">
              <div className="grid col-span-4">
                <p className="text-base text-center">All Amenties</p>
              </div>
              <div className="grid col-span-1 items-center">
                <ArrowRightIcon className="w-5 grid col-span-1" />
              </div>
            </div>
          </div>
        </a>
        <AAmenities open={open} from={setOpen} data={amen} />
      </div>
    );
  }
}
