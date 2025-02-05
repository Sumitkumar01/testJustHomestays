import React from "react";
import { FilterIcon, SortByIcon } from "../util/icons";

const BottomFilters = ({ setShowFilterPopup, setShowSortByPopup }) => {
  const btnData = [
    {
      id: 1,
      title: "Sort by",
      icon: <SortByIcon />,
      onclick: () => {
        setShowSortByPopup(true);
      },
    },
    {
      id: 2,
      title: "Filter",
      icon: <FilterIcon />,
      onclick: () => {
        setShowFilterPopup(true);
      },
    },
  ];
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 w-full flex items-center z-30 bg-white border-light border-t  px-4 py-6"
      style={{ boxShadow: "0px 7px 29px 0px rgba(100, 100, 111, 0.20)" }}
    >
      {btnData.map((btn, index) => (
        <React.Fragment key={index}>
          <button
            onClick={btn.onclick}
            className="flex items-center justify-center bg-white w-full py-2"
          >
            {btn.icon}
            <span className="ml-2">{btn.title}</span>
          </button>
          {index !== btnData.length - 1 && <div className="w-1 h-6 bg-light" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BottomFilters;
