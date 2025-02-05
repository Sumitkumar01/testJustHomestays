import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import ReactPaginate from "react-paginate";

const justHomeStay = () => {
  const router = useRouter();
  const [justHomeStayData, setJustHomeStayData] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [searchById, setSearchById] = useState("");
  const [searchByTown, setSearchByTown] = useState("");
  const { deleteCookie, getCookie } = useCookies();

  const [pageNumber, setPageNumber] = useState(0);

  const hanndleSearchById = () => {
    if (searchById) {
      const options = {
        method: "GET",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
        params: { where: "(PID,eq," + searchById + ")" },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      axios.request(options).then(function (res) {
        if (res.data.list.length === 0) {
          alert("ID Not Found");
        } else {
          setJustHomeStayData([res.data.list[0]]);
        }
        setSearchById("");
      });
    } else {
      alert("Enter Valid ID");
    }
  };

  const hanndleSearchByTown = () => {
    if (searchByTown) {
      const options = {
        method: "GET",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
        params: { where: "(City,eq," + searchByTown + ")" },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      axios.request(options).then(function (res) {
        if (res.data.list.length === 0) {
          alert("Town Not Fopund");
        } else {
          setJustHomeStayData(res.data.list);
        }
        setSearchByTown("");
      });
    } else {
      alert("Enter valid Town");
    }
  };

  const dataPerPage = 20;
  const pagesVisited = pageNumber * dataPerPage;
  let displayData;
  if (justHomeStayData) {
    displayData = justHomeStayData
      .slice(pagesVisited, pagesVisited + dataPerPage)
      .map((data, index) => {
        return (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 px-4 py-2  border-b-2 border-solid border-[#c5f542]"
          >
            <p>{data.Title}</p>
            <p className="text-center">
              {data.Location[0] && data.Location[0].Town}
            </p>
            <p className="text-center">{data["Cost per Night"]}</p>
            <p className="text-center">{data["Total Guests"]}</p>
            <p className="flex text-center gap-4 items-center justify-around">
              <a href={`justHsImages?pid=${data.PID}`} target={"_blank"}>
                <button className="bg-[#c5f542] py-1 px-3 rounded-md">
                  Images
                </button>
              </a>
              <a href={`justHsDesc?pid=${data.PID}`} target={"_blank"}>
                <button className="bg-[#c5f542] py-1 px-3 rounded-md">
                  Description
                </button>
              </a>
              <a href={`justHsInfo?pid=${data.PID}`} target={"_blank"}>
                <button className="bg-[#c5f542] py-1 px-3 rounded-md">
                  Info
                </button>
              </a>
              <a href={`roomsjhs?pid=${data.PID}`} target="_blank">
                <button className="bg-[#c5f542] py-1 px-3 rounded-md">
                  Rooms
                </button>
              </a>
            </p>
          </div>
        );
      });
  }
  let pageCount;
  if (justHomeStayData) {
    pageCount = Math.ceil(justHomeStayData.length / dataPerPage);
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const options = {
    method: "GET",
    url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
    params: { limit: "1000", where: "", sort: "Town" },
    headers: {
      "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
    },
  };

  const getData = () => {
    axios.request(options).then(function (res) {
      setJustHomeStayData(res.data.list);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  }, []);

  if (isLoggedIn) {
    if (justHomeStayData) {
      const logOutHandler = () => {
        deleteCookie("isAdminLoggedIn");
        router.push("/management/login");
      };

      return (
        <>
          <div className="relative">
            <div className="flex justify-between gap-5 px-8 pt-4">
              <div className="flex gap-5">
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
                    onClick={hanndleSearchById}
                  >
                    Search by ID
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
                    onClick={hanndleSearchByTown}
                  >
                    Search by Town
                  </button>
                </div>
              </div>
              <div className="flex gap-5">
                <a href={"/management/login"}>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                    Go Back
                  </button>
                </a>

                <button
                  className="px-6 py-2 bg-red-500 text-white rounded-lg"
                  onClick={logOutHandler}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="my-6 px-8 items-center ">
              <div className="border-4 border-[#c5f542] rounded-lg">
                <div className="grid grid-cols-5 gap-2 bg-[#c5f542] px-4 py-2 text-xl font-bold ">
                  <p>Title</p>
                  <p className="text-center">Town</p>
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
  } else {
    return (
      <>
        <div className="w-full h-[100vh] ">
          <div className="flex flex-col  justify-center items-center mx-auto w-[30%] mt-[10%]">
            <h1 className="font-semibold text-2xl py-10">
              To get access login first
            </h1>
            <a href="/management/login">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Login
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }
};

export default justHomeStay;
