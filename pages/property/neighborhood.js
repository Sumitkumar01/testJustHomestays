import { useState, useEffect } from "react";
import axios from "axios";

export default function Neighborhood({ town }) {
  const [loc, setLoc] = useState([]);

  const options = {
    method: "GET",
    url: process.env.API_URL + "Location/",
    params: { where: `(Town,like,%${town}%)` },
    headers: {
      "xc-token": process.env.API_KEY,
    },
  };

  const getData = async () => {
    const tick = await axios.request(options);
    setLoc(tick.data.list);
  };

  useEffect(() => {
    if (loc.length === 0) {
      getData();
    }
  }, [loc]);

  const findExactMatch = () => {
    for (const location of loc) {
      if (location.Town.toLowerCase() === town) {
        return location;
      }
    }
    return loc[0];
  };

  if (loc.length >= 1) {
    const location = findExactMatch();
    return (
      <div>
        <iframe
          src={location.Link}
          width="100%"
          height="450"
          allowFullScreen=""
          loading="lazy"
          className="rounded-none"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <p className="font-bold mt-6 text-xl">
          {location.Town + ", " + location.State}
        </p>
        <p>{location.Description}</p>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
