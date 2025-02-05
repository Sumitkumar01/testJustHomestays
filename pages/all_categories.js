import Footer from "./Footer.jsx";
import Header from "./header";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import CCard from "./categoryCard";

export default function AllCategories() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data } = await axios.get(
          "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Categories?where=(Active,eq,true)",
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

  const sendEvent = (category) => {
    window.gtag("event", "category_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a category",
      category_name: category,
    });
  };
  // console.log("data" + categoryData.map((item) => item));
  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full md:px-0 px-4">
        <Header />
        <div className="my-6 justify-center mx-auto px-4">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-x-2 gap-y-4">
            {categoryData.map((category) => (
              <div key={category.Id} className="grid col-span-1">
                <a
                  onClick={() => sendEvent(category.Title)}
                  className="cursor-pointer"
                  href={"category/" + category.slug}
                >
                  <CCard
                    category={category.Title}
                    image={category.Images[0].path}
                    number={
                      Number(category.CountJHS) + Number(category.CountSV)
                    }
                    alt={`${category.Title} | Just Home Stay`}
                  />
                  
                </a>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
