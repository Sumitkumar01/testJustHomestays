import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const Data = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [selectedimg, setSelectedimg] = useState([]);
  const [longdes, setLongDes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  },[]);

  const getData = (options) => {
    axios.request(options).then(function (res) {
      setData(JSON.parse(res.data.list[0].Photos));
      console.log(res.data.list[0].Description);
    });
  };

  const selected = (img) => {
    setSelectedimg([...selectedimg, img.target.src]);
  };

  const remove = (img) => {
    setSelectedimg((current) =>
      current.filter((image) => image !== img.target.src)
    );
  };

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "GET",
      url: process.env.API_URL + "StayVista",
      params: { limit: "1000", where: "(PID,eq," + id + ")", sort: "Town" },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    getData(options);
  }, []);

  const selectAll = () => {
    setSelectedimg(
      data.map((img) => {
        return img.source;
      })
    );
  };

  const removeAll = () => {
    setSelectedimg([]);
  };

  const writetoDb = async () => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "PATCH",
      url: process.env.API_URL + "StayVista/" + id,
      headers: {
        "xc-token": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      data: { Images: JSON.stringify(selectedimg) },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      alert("Images Uploaded");
    }
  };
  const logOutHandler = () => {
    deleteCookie("isAdminLoggedIn");
    router.push("/management/login");
  };

  if (isLoggedIn) {
    if (data) {
      return (
        <>
          <div className="my-5 mx-2">
          <a className="bg-primary py-4 px-8 text-white rounded-lg" href="../management/stayVista">
            Go Back
          </a>
          <a className="bg-red-500 py-4 px-8 text-white rounded-lg mx-5" >
            <button onClick={logOutHandler}>Logout</button>
          </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 grid grid-cols-3 gap-4">
              <div className="grid col-span-1">
                <button className="w-full" onClick={() => selectAll()}>
                  Select All
                </button>
                <button className="w-full" onClick={() => removeAll()}>
                  Remove All
                </button>
              </div>
              {data.map((img, index) => {
                return (
                  <div key={index} className="grid col-span-1">
                    <img onClick={(e) => selected(e)} src={img.source} />
                  </div>
                );
              })}
            </div>
            <div className="col-span-1 grid grid-cols-6 gap-2 mb-auto">
              {selectedimg.map((img, index) => {
                return (
                  <div key={index} className="grid col-span-1">
                    <img onClick={(e) => remove(e)} src={img} />
                  </div>
                );
              })}
              {selectedimg && selectedimg.length >= 1 ? (
                <button
                  className="col-span-6 w-full py-4 bg-primary text-white"
                  onClick={() => writetoDb()}
                >
                  Submit
                </button>
              ) : null}
            </div>
          </div>
        </>
      );
    }else{
      return (
        <>
          <div className="my-5 mx-2">
          <a className="bg-primary py-4 px-8 text-white rounded-lg" href="../management/stayVista">
            Go Back
          </a>
          <a className="bg-red-500 py-4 px-8 text-white rounded-lg mx-5" >
            <button onClick={logOutHandler}>Logout</button>
          </a>
          </div>
          <div className="w-full flex">
              <div className="mx-auto my-20">
                
                  <h1 className="font-semibold text-2xl">Images Not available</h1>
                
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
            <h1 className="font-semibold text-2xl py-10">To get access login first</h1>
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

export default Data;
