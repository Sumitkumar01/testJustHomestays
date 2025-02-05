import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AddAmen(props) {
  const [amen, setAmen] = useState([]);
  const [selectedamen, setSelectedAmen] = useState([]);
  const router = useRouter();

  const getAmenities = async () => {
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Amenities",
      params: { limit: 1000 },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    axios.request(options).then(function (res) {
      setAmen(res.data.list);
    });
  };

  useEffect(() => {
    getAmenities();
  }, []);

  useEffect(() => {
    if (props && props.data) {
      console.log(props.data);
      setSelectedAmen(props.data);
    }
  }, [props]);

  const updateAmenities = async (ncRecordId) => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "POST",
      url: `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista/${id}/mm/Amenity/${ncRecordId}`,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    axios.request(options);
  };

  const updateAmen = async () => {
    const existingIds = new Set(props.data.map((item) => item.ncRecordId));
    const selectedIds = new Set(selectedamen.map((item) => item.ncRecordId));

    const newAmenities = selectedamen.filter(
      (item) => !existingIds.has(item.ncRecordId)
    );

    const removedAmenities = props.data.filter(
      (item) => !selectedIds.has(item.ncRecordId)
    );

    for (const amenity of newAmenities) {
      await updateAmenities(amenity.ncRecordId);
    }

    for (const amenity of removedAmenities) {
      await deleteAmenity(amenity.ncRecordId); // Implement this function
    }

    alert("Amenities updated successfully!");
  };

  const deleteAmenity = async (ncRecordId) => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "DELETE",
      url: `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista/${id}/mm/Amenity/${ncRecordId}`,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    axios.request(options);
  };

  const addToList = (selectedItem) => {
    const isAlreadySelected = selectedamen.some(
      (amen) => amen.ncRecordId === selectedItem.ncRecordId
    );

    if (!isAlreadySelected) {
      setSelectedAmen([...selectedamen, selectedItem]);
    } else {
      setSelectedAmen(
        selectedamen.filter(
          (amen) => amen.ncRecordId !== selectedItem.ncRecordId
        )
      );
    }
  };

  if (props && props.existing)
    return (
      <>
        <div className="w-full my-4 flex  items-start justify-start gap-4">
          <p>
            <button
              className="bg-[#3F85F4] text-white py-2 px-4 rounded-md "
              onClick={() => router.push(`/management/stayVista`)}
            >
              Go Back
            </button>
          </p>
          <p>
            <button
              className="bg-[#0e8d3f] text-white py-2 px-4 rounded-md"
              onClick={() => updateAmen()}
            >
              Insert Amenities
            </button>
          </p>
          <p>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-lg"
              onClick={props.logout}
            >
              Logout
            </button>
          </p>
        </div>
        <div className="flex justify-between gap-x-4 w-full font-bold">
          <p>All Amenities</p>
          <p>Selected Amenities</p>
          <p>Offered Amenities</p>
        </div>
        <div className="flex justify-between gap-x-4 w-full">
          <div className="flex flex-col gap-2 max-h-screen overflow-auto">
            {amen.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => addToList(item)}
                  className="flex gap-x-4 py-2 px-4 rounded-md border-2 border-primary items-center"
                >
                  <Image
                    width={50}
                    height={50}
                    src={`https://test.justhomestay.in/${item.Icon[0].path}`}
                    alt={item.Name || "Just home stay"} 
                  />
                  <p>{item.Name}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 max-h-screen overflow-auto">
            {selectedamen.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex gap-x-4 py-2 px-4 rounded-md border-2 border-secondary items-center"
                >
                  <p>{item.Name}</p>
                </div>
              );
            })}
          </div>
          <div>
            {JSON.parse(props.existing).map((item, index) => {
              return (
                <div key={index}>
                  <p>{item.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
}
