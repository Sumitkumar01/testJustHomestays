import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropertyCard2 from "./PropertyCard2";
import CategoriesPopup from "./CategoriesPopup";
import { NextBtnIcon, OutlineArrow, PrevBtnIcon } from "../util/icons";
import axios from "axios";
import { SectionWithContainer } from "./SectionComponents";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Grid, Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/grid";

const ExploreCategories = () => {
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

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <SectionWithContainer>
      <div className="flex flex-col gap-6 w-full px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-normal">
            Explore Categories
          </h2>
          <Link
            className="lg:flex hidden border gap-2 shadow-inner shadow-gray-50 items-center justify-center py-4 px-4 rounded-lg border-normal font-medium"
            href={"/all_categories"}
          >
            Explore all Categories{" "}
            <span>
              <OutlineArrow />
            </span>
          </Link>
        </div>
        <div className="grid lg:hidden grid-cols-2 gap-4">
          {categoryData?.map((cat) => (
            <Link
              className="cursor-pointer"
              href={"category/" + cat.slug}
              key={cat.Id}
            >
              <PropertyCard2
                title={cat.Title}
                alt={cat.Title || "Property"}
                image={cat.Images[0].path}
              />
            </Link>
          ))}
        </div>
        <div className="relative w-full">
          <div className="lg:grid grid-cols-3 gap-6 hidden thumbs">
            <div className="col-span-1 w-full h-full">
              <Swiper
                
                spaceBetween={10}
                navigation={{
                  nextEl: ".thumbs-next",
                  prevEl: ".thumbs-prev",
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                pagination={{ el: ".pagination" }}
                className="mySwiper2 w-full h-full"
              >
                {categoryData.map((cat) => (
                  <SwiperSlide key={cat.Id} className="w-full h-full">
                    <Link
                      className="cursor-pointer aspect-square w-full h-full"
                      href={"category/" + cat.slug}
                      key={cat.Id}
                    >
                      <PropertyCard2
                        title={cat.Title}
                        alt={cat.Title || "Property"}
                        image={cat.Images[0].path}
                        asp="lg:aspect-[4/2] h-full"
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="col-span-2">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={24}
                slidesPerView={2}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs, Grid]}
                grid={{
                  rows: "2",
                  fill: "row",
                }}
                className=""
              >
                {categoryData?.map((cat) => (
                  <SwiperSlide key={cat.Id}>
                    <Link
                      className="cursor-pointer"
                      href={"category/" + cat.slug}
                      key={cat.Id}
                    >
                      <PropertyCard2
                        title={cat.Title}
                        alt={cat.Title || "Property"}
                        image={cat.Images[0].path}
                        asp="lg:aspect-[4/2.8] h-full"
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <button className="thumbs-next absolute top-1/2 -right-14 z-10 transform -translate-y-1/2">
            <NextBtnIcon />
          </button>
          <button className="thumbs-prev absolute top-1/2 -left-14 z-10 transform -translate-y-1/2">
            <PrevBtnIcon />
          </button>
        </div>
        <button
          className="flex lg:hidden border gap-2 shadow-inner shadow-gray-50 items-center justify-center py-4 px-4 rounded-lg border-normal font-medium"
          onClick={() => setShowCategoriesPopup(true)}
        >
          Explore all Categories{" "}
          <span>
            <OutlineArrow />
          </span>
        </button>
      </div>
      {showCategoriesPopup && (
        <CategoriesPopup
          setShowCategoriesPopup={setShowCategoriesPopup}
          showCategoriesPopup={showCategoriesPopup}
        />
      )}
    </SectionWithContainer>
  );
};

export default ExploreCategories;
