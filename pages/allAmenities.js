import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { BsXLg } from "react-icons/bs";

export default function AAmenities(props) {
  const amen = props.data;

  if (props.open && amen) {
    return (
      <div
        onClick={() => props.from(false)}
        className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="modal-box max-w-screen-xl p-4 text-right">
          <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
              onClick={() => props.from(false)}
            >
              <BsXLg className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center mx-auto justify-center">
            <p className="font-bold text-center text-lg">Filter by Amenities</p>
          </div>
          <div className="overflow-y-hidden mt-4">
            <div className="grid md:grid-cols-4 grid-cols-1 gap-4 overflow-y-auto p-2">
              {amen.map((am) => (
                <div
                  className="grid col-span-1 p-2 text-left outline outline-secondary outline-2 rounded-lg"
                  key={am.ID}
                >
                  <div
                    onClick={() => router.push("/all-properties?id=" + am.ID)}
                    className="grid grid-cols-3 gap-2 cursor-pointer"
                  >
                    <div className="grid col-span-1 py-2 m-auto">
                      <Image
                        src={
                          "http://test.justhomestay.in:8080/" + am.Icon[0].path
                        }
                        className="w-2/3 aspect-square text-center mx-auto"
                        width={100}
                        height={100}
                        quality={20}
                        alt={am.Name || "Justhome Stay"}
                      />
                    </div>
                    <div className="grid col-span-2 py-2 m-auto w-full">
                      <p className="text-base font-bold">{am.Name}</p>
                      <p className="text-sm">{am.Type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
