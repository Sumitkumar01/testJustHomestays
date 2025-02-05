import { useState, useEffect, memo } from "react";
import axios from "axios";
import Image from "next/image";

const BCard = memo(({ id, index }) => {
  const [bedroom, setBedroom] = useState(null);

  const fetchBedroomData = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Bedrooms",
      params: { where: `(ncRecordId,eq,${id.ncRecordId})` },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    try {
      const response = await axios.request(options);
      setBedroom(response.data.list[0]);
    } catch (error) {
      console.error("Error fetching bedroom data:", error);
    }
  };

  useEffect(() => {
    if (id && "ncRecordId" in id) {
      fetchBedroomData();
    }
  }, [id]);

  if (bedroom && bedroom.BID >= 0) {
    return (
      <div className="flex flex-col bg-base-100 rounded-lg drop-shadow-md gap-x-4">
        <Image
          src={bedroom.Image}
          width={400}
          height={300}
          className="rounded-t-xl w-full aspect-[4/3] object-cover max-w-64"
        />
        <div className="flex flex-col px-2 pb-2">
          <p className="font-bold text-base mt-2">{bedroom.Name}</p>
          <p>{bedroom["Type of Bed"]}</p>
        </div>
      </div>
    );
  }

  return null;
});

export default BCard;
