import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import Select from "react-select";

const AllPhotos = ({ logOut }) => {
  const router = useRouter();
  const [loc, setLoc] = useState();
  const [multiplier, setMultiplier] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchById, setSearchById] = useState("");
  const [searchByTown, setSearchByTown] = useState("");
  const [searchbyType, setsearchbyType] = useState("");

  const handleSearchById = () => {
    if (searchById) {
      console.log(typeof searchById);
      const options = {
        method: "GET",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista",
        params: { limit: "1000", where: "(Id,eq," + searchById + ")" },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      axios.request(options).then(function (res) {
        if (res.data.list.length === 0) {
          alert("ID Not Found");
        } else {
          setLoc(res.data.list);
        }
        setSearchById("");
      });
    } else {
      alert("Enter Valid ID");
    }
  };

  const handleSearchByTown = () => {
    if (searchByTown) {
      const options = {
        method: "GET",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista",
        params: {
          limit: "1000",
          where: "(City,eq," + searchByTown.toLowerCase() + ")",
        },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      axios.request(options).then(function (res) {
        if (res.data.list.length === 0) {
          alert("Town Not Found");
        } else {
          setLoc(res.data.list);
        }
        setSearchByTown("");
      });
    } else {
      alert("Enter Valid Town");
    }
  };

  const handleSearchbyType = () => {
    if (searchbyType) {
      const options = {
        method: "GET",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista",
        params: {
          limit: "1000",
          where: "(PropertyType,like," + searchbyType.toLowerCase() + ")",
        },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      axios.request(options).then(function (res) {
        if (res.data.list.length === 0) {
          alert("Type Not Found");
        } else {
          setLoc(res.data.list);
        }
        setSearchByTown("");
      });
    } else {
      alert("Enter Valid Type");
    }
  };

  const dataPerPage = 20;
  const pagesVisited = pageNumber * dataPerPage;
  let displayData;
  if (loc) {
    displayData = loc
      .slice(pagesVisited, pagesVisited + dataPerPage)
      .map((data, index) => {
        return (
          <div
            key={index}
            className="flex justify-between gap-2 px-4 py-2  border-b-2 border-solid border-[#c5f542]"
          >
            <p className="flex basis-1/4">{data.Title}</p>
            <p className="flex basis-1/12">{data.PID}</p>
            <p className="flex basis-1/6 text-center">
              {data.Location[0] && data.Location[0].Town}
            </p>
            <p className="text-center">{data["Cost per Night"]}</p>
            <p className="text-center">{data["Total Guests"]}</p>
            <p className="flex text-center gap-4 items-center justify-around">
              <a href={`data?pid=${data.PID}`} target={"_blank"}>
                <button className="bg-secondary py-1 px-3 rounded-md">
                  Images
                </button>
              </a>
              <a href={`description?pid=${data.PID}`} target={"_blank"}>
                <button className="bg-secondary py-1 px-3 rounded-md">
                  Description
                </button>
              </a>
              <a href={`info?pid=${data.PID}`} target={"_blank"}>
                <button className="bg-secondary py-1 px-3 rounded-md">
                  Info
                </button>
              </a>
              <a href={`amenities?pid=${data.PID}`} target="_blank">
                <button className="bg-secondary py-1 px-3 rounded-md">
                  Amenities
                </button>
              </a>
              <a href={`rooms?pid=${data.PID}`} target="_blank">
                <button className="bg-secondary py-1 px-3 rounded-md">
                  Rooms
                </button>
              </a>
            </p>
          </div>
        );
      });
  }
  let pageCount;
  if (loc) {
    pageCount = Math.ceil(loc.length / dataPerPage);
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const options3 = {
    method: "PATCH",
    url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Admin/1",
    headers: {
      "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    data: {
      "SV Multiplier": multiplier,
    },
  };

  const options = {
    method: "GET",
    url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista/",
    params: { limit: "1000", where: "", sort: "Town" },
    headers: {
      "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
    },
  };

  const options2 = {
    method: "GET",
    url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Admin",
    params: {
      limit: "1",
      where: "",
      sort: "",
      fields: "PID,Title,Location,Cost per Night,Total Guests",
    },
    headers: {
      "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
    },
  };

  const submitMulti = () => {
    axios.request(options3).then(function (res) {
      if (res && res.status && res.status === 200) {
        alert("StaVista Multiplier Updated");
      } else {
        console.log(res);
      }
    });
  };

  const getAdmin = () => {
    axios.request(options2).then(function (res) {
      setMultiplier(res.data.list[0]["SV Multiplier"]);
    });
  };

  const getData = () => {
    axios.request(options).then(function (res) {
      setLoc(res.data.list);
    });
    getAdmin();
  };

  useEffect(() => {
    getData();
  }, []);

  const dropOptions = [
    { value: "private room", label: "Private Room" },
    { value: "entire place", label: "Entire Place" },
  ];

  if (loc && displayData) {
    return (
      <>
        <div className="relative mt-4">
          <div className="w-full flex justify-between pr-8">
            <div className="flex gap-4 pl-8">
              <div className="flex gap-2">
                <input
                  type="number"
                  name="SearchById"
                  className="rounded-md border  border-solid border-black px-4 py-2 bg-gray-300"
                  value={searchById}
                  onChange={(e) => setSearchById(e.target.value)}
                />
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-lg"
                  onClick={handleSearchById}
                >
                  ID
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="SearchByTown"
                  className="rounded-md border  border-solid border-black px-4 py-2 bg-gray-300"
                  value={searchByTown}
                  onChange={(e) => setSearchByTown(e.target.value)}
                />
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-lg"
                  onClick={handleSearchByTown}
                >
                  Town
                </button>
              </div>
              <div className="flex gap-2">
                <Select
                  onChange={(e) => setsearchbyType(e.value)}
                  options={dropOptions}
                />
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-lg"
                  onClick={handleSearchbyType}
                >
                  Type
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center   gap-4">
              <div>
                <p>Admin Setting</p>
              </div>
              <div>
                <input
                  className="bg-white  border border-black w-full h-8 rounded-lg px-2"
                  type="number"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                />
              </div>
              <div
                onClick={(e) => submitMulti()}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                Update
              </div>
            </div>
            <div className="flex gap-5">
              <a href={"/management/login"}>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                  Back
                </button>
              </a>
            </div>
          </div>
          <div className="my-6 px-8 items-center ">
            <div className="border-4 border-[#c5f542] rounded-lg">
              <div className="flex justify-between gap-2 bg-[#c5f542] px-4 py-2 text-xl font-bold ">
                <p className="flex basis-1/4">Title</p>
                <p className="flex basis-1/12">PID</p>
                <p className="flex basis-1/6 text-center">Town</p>
                <p className="text-center">Cost Per Night</p>
                <p className="text-center">Total Guests</p>
                <p className="text-center">Select</p>
              </div>
              {displayData}
              <div className="mt-4 my-2 mx-auto flex justify-center items-center">
                <ReactPaginate
                  previousLabel={"< Previous"}
                  nextLabel={"Next >"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  breakLabel="..."
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default AllPhotos;
