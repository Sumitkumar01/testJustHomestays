import { useState, useEffect } from "react";
import axios from "axios";

export default function ACard({ id, all }) {
  const [amenity, setAmenity] = useState([]);

  const options = {
    method: "GET",
    url: `${process.env.API_URL}Amenities`,
    params: { where: `(ncRecordId,eq,${id})` },
    headers: {
      "xc-token": process.env.API_KEY
    }
  };

  const fetchAmenity = async () => {
    const amen = await axios.request(options);
    setAmenity(amen.data.list[0]);
  };

  useEffect(() => {
    if (id && amenity.length === 0) {
      fetchAmenity();
    }
  }, [id, amenity]);

  if (amenity.length !== 0) {
    return (
      <div className="items-center  flex gap-2 lg:grid grid-cols-4">
        <div className="md:grid md:col-span-1">
          {amenity && (
            <img
              src={`https://test.justhomestay.in/${amenity.Icon[0].path}`}
              className="mx-auto w-8 md:w-full"
            />
          )}
        </div>
        <div className="md:grid md:col-span-3 my-auto md:text-left text-center">
          <p>{amenity.Name}</p>
          {all && <p>{amenity.Type}</p>}
        </div>
      </div>
    );
  }

  return null;
}
