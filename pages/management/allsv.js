import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

const AllPhotos = () => {
  const router = useRouter();
  const [loc, setLoc] = useState();
  const [pageNumber, setPageNumber] = useState(0);
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
            className="grid grid-cols-6 gap-2 px-4 py-2 border-b-2 border-solid"
          >
            <p>{data.Title}</p>
            <p className="text-center">
              {data.Location[0] && data.Location[0].Town}
            </p>
            <p className="text-center">{data["Cost per Night"]}</p>
            <p className="text-center">{data["Total Guests"]}</p>
            <p className="text-center">
              {data["Images"] !== null
                ? JSON.parse(data["Images"]).length
                : null}
            </p>
            <p className="text-center">
              <a
                className="bg-primary text-white py-1 px-3 rounded-md"
                href={"/management/data?pid=" + data.PID}
              >
                Select
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

  const options = {
    method: "GET",
    url: process.env.API_URL + "StayVista",
    params: { limit: "1000", where: "", sort: "Town" },
    headers: {
      "xc-token": process.env.API_KEY
    }
  };

  const getData = () => {
    axios.request(options).then(function (res) {
      setLoc(res.data.list);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  if (loc) {
    return (
      <>
        <div className="pt-6 px-8 items-center ">
          <div className="border-4 rounded-lg">
            <div className="grid grid-cols-6 gap-2 bg-primary text-white px-4 py-2 text-xl font-bold ">
              <p>Title</p>
              <p className="text-center">Town</p>
              <p className="text-center">Cost Per Night</p>
              <p className="text-center">Total Guests</p>
              <p className="text-center">Selected Images</p>
              <p className="text-center">Select</p>
            </div>
            {displayData}
            <div className="mt-4">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBtn"}
                nextLinkClassName={"nextBtn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else return <p>Loading...</p>;
};

export default AllPhotos;
