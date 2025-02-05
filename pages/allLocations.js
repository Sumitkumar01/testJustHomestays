import React, { useState, useEffect } from "react";
import LCard from "./locationCard";
import { BsXLg } from "react-icons/bs";

export default function ALocations(props) {
  const [loc, setLoc] = useState([]);
  var myHeaders = new Headers();

  myHeaders.append(
    "xc-auth",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVkaXRAY3Jpc3Njcm9zc2xhYi5jb20iLCJmaXJzdG5hbWUiOm51bGwsImxhc3RuYW1lIjpudWxsLCJpZCI6InVzX2dzOWI5eHllY3oyMXhjIiwicm9sZXMiOiJvcmctbGV2ZWwtY3JlYXRvcixzdXBlciIsInRva2VuX3ZlcnNpb24iOiJhNTE2ZWMzMDBkNzE4MWNlYmM2ZjlmZjU0ZTM5ZGRjYTc1ZDRiZGU2YjM1MzE4YjBiNDU1ZDAzNjE3ZjdmZGRkZDMyMGEyYjdiYzQ4OTA2ZCIsImlhdCI6MTY4MjA2ODIwOCwiZXhwIjoxNjgyMTA0MjA4fQ.Xg9_n5JbBW-4CASRxGkRERAfcZ-1I1H2uhH2UNOW7-0"
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const getData = () => {
    fetch(
      "http://localhost:8080/api/v1/db/data/noco/p_wa98zvkmqux8mm/Location/views/Grid%20view",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((myJson) => {
        setLoc(myJson.records);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  if (props.open) {
    return (
      <div
        onClick={() => props.from(false)}
        className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="modal-box max-w-screen-xl md:p-4 text-right">
          <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
              onClick={() => props.from(false)}
            >
              <BsXLg className="h-6 w-6" />
            </button>
          </div>
          <p className="font-bold text-center text-lg">All destinations</p>
          <div className="grid grid-cols-6 gap-2 mt-4 overflow-y-auto">
            {loc.map((lc) => (
              <div
                key={lc.fields.UID}
                className="grid col-span-1"
                onClick={() => {
                  props.newLoc(lc.fields.Town + ", " + lc.fields.State);
                  props.newTown(lc.fields.Town);
                }}
              >
                <LCard
                  image={"https://jhsstorage.biz/images/" + lc.fields.Image}
                  state={lc.fields.State}
                  location={lc.fields.Town}
                  number={lc.fields.TotalCount}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
