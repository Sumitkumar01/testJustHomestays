import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import RI from "./roomImage";
import BCard from "../property/bedroomcard";

export default function SRooms(props) {
  const [maxRooms, setMaxRooms] = useState(0);
  const [images, setImages] = useState([]);
  const [existing, setExisting] = useState([]);
  const [pid, setPid] = useState("");

  const [selectedImage, setSelectedImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [bedType, setBedType] = useState("");
  const [bid, setBid] = useState(0);
  const [riopen, setRiopen] = useState(false);

  const handleReset = () => {
    setRoomName("");
    setBedType("");
    setSelectedImage("");
  };

  useEffect(() => {
    setMaxRooms(props.count);
    setImages(props.images);
    setExisting(props.existing);
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    setPid(id);
    if (props?.existing) {
      setBid(Number(props.existing.length) + 1);
    }
  }, [props, props.reset]);

  const handleSubmit = async () => {
    const options = {
      method: "POST",
      url: `${process.env.API_URL}Bedrooms`,
      headers: {
        "xc-token": `${process.env.API_KEY}`,
      },
      data: {
        Name: roomName,
        "Type of Bed": bedType,
        BID: bid,
        Type: props.ptype,
        PID: pid,
        Image: selectedImage,
      },
    };
    const createRoom = await axios.request(options);
    if (createRoom.status === 200) {
      const options2 = {
        method: "POST",
        url: `${process.env.API_URL}Bedrooms/${createRoom.data.ncRecordId}/mm/StayVistaList/${pid}`,
        headers: {
          "xc-token": `${process.env.API_KEY}`,
        },
      };
      const setRoom = await axios.request(options2);
      if (setRoom.status === 200) {
        alert("Room Created");
        props.setreset(true);
        handleReset();
      }
    }
  };

  const deleteBedroom = async (roomid) => {
    const options2 = {
      method: "DELETE",
      url: `${process.env.API_URL}Bedrooms/${roomid.ncRecordId}/mm/StayVistaList/${pid}`,
      headers: {
        "xc-token": `${process.env.API_KEY}`,
      },
    };
    const options = {
      method: "DELETE",
      url: `${process.env.API_URL}Bedrooms/${roomid.ncRecordId}`,
      headers: {
        "xc-token": `${process.env.API_KEY}`,
      },
    };
    const deleterelation = await axios.request(options2);
    if (deleterelation.status === 200) {
      const deleteroom = await axios.request(options);
      if (deleteroom.status === 200) {
        alert("Room Deleted");
        props.setreset(true);
        handleReset();
      }
    }
  };

  if (maxRooms)
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
              className="px-6 py-2 bg-red-500 text-white rounded-lg"
              onClick={props.logout}
            >
              Logout
            </button>
          </p>
        </div>
        <div className="flex justify-between gap-x-4 w-full font-bold">
          <p>Add new room</p>
          <p>Existing rooms</p>
        </div>
        <div className="flex justify-between gap-x-4 w-full">
          {existing?.length != maxRooms ? (
            <div className="flex flex-col gap-y-2 py-2">
              <input
                className="input input-bordered w-full max-w-sm"
                type="text"
                placeholder="Enter Name for Bedroom"
                onChange={(e) => setRoomName(e.target.value)}
              />
              <select
                defaultValue="Select Bed Type"
                onChange={(e) => setBedType(e.target.value)}
                className="select select-bordered w-full max-w-sm"
              >
                <option disabled value="Select Bed Type">
                  Select Bed Type
                </option>
                <option value="Single Bed">Single Bed</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Queen Bed">Queen Bed</option>
                <option value="King Bed">King Bed</option>
              </select>
              <div className="flex gap-x-2">
                <button
                  className="btn btn-primary"
                  onClick={() => setRiopen(true)}
                >
                  Select Image
                </button>
                {selectedImage ? (
                  <Image
                    alt="Selected Image"
                    width={200}
                    height={200}
                    src={selectedImage}
                  />
                ) : null}
              </div>
              <input
                type="number"
                className="input input-bordered w-full max-w-sm"
                placeholder="Enter Bedroom ID"
                value={bid}
                readOnly
              />
              <button
                onClick={() => handleSubmit()}
                className="btn btn-secondary mt-4"
              >
                SUBMIT
              </button>
            </div>
          ) : (
            <p>All rooms created</p>
          )}
          <div className="flex max-w-4xl flex-grow flex-wrap gap-4 justify-end py-2">
            {existing?.length > 0 &&
              existing.map((roomid, index) => (
                <div key={index} onClick={() => deleteBedroom(roomid)}>
                  <BCard id={roomid} />
                </div>
              ))}
          </div>
        </div>
        <RI
          open={riopen}
          from={setRiopen}
          images={images}
          selected={setSelectedImage}
          type={props.ptype}
        />
      </>
    );
}
