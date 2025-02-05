"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CCard from "./categoryCard";
import { useRouter } from "next/router";
import CategoriesPopup from "../newComponents/CategoriesPopup";

const Categories = () => {
  const [categoryData, setCategoryData] = useState([]);
  const router = useRouter();
  const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data } = await axios.get(
          "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Categories?where=(Active,eq,true)&limit=6",
          {
            headers: {
              "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
            },
          }
        );
        setCategoryData(data.list);
      } catch (error) {
        console.error("Failed to fetch category data", error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <>
      <div className="mt-6 justify-center mx-auto px-4">
        <div className="grid md:grid-cols-6 grid-cols-2 gap-x-2 gap-y-4">
          {categoryData.map((cat) => (
            <div key={cat.Id} className="grid col-span-1">
              <a className="cursor-pointer" href={"category/" + cat.slug}>
                <CCard
                  category={cat.Title}
                  image={cat.Images[0].path}
                  number={Number(cat.CountJHS) + Number(cat.CountSV)}
                />
              </a>
            </div>
          ))}
        </div>
        <div
          className="mx-auto w-max mt-8 lg:block hidden"
          onClick={() => router.push("/all_categories")}
        >
          <div className="flex px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary cursor-pointer">
            <p className="text-base">Explore all Categories</p>
          </div>
        </div>
      </div>
      <button
        className="flex mx-auto lg:hidden px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary cursor-pointer"
        onClick={() => setShowCategoriesPopup(true)}
      >
        Explore all Categories
      </button>
      {showCategoriesPopup && (
        <CategoriesPopup
          setShowCategoriesPopup={setShowCategoriesPopup}
          showCategoriesPopup={showCategoriesPopup}
        />
      )}
    </>
  );
};

export default Categories;
