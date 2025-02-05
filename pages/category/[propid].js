import React, { useState, useEffect } from "react";
import Footer from "../Footer.jsx";
import PHCard from "../propCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { ColorRing } from "react-loader-spinner";
import Bottombar from "../bottomBar";
import Head from "next/head";
import Heading from "../headings";
import BackToTop from "../backtoptop";
import Header from "../header";
import FilterPopup from "../../newComponents/FilterPopup";
import SortByPopup from "../../newComponents/SortByPopup";
import {
  FilterIcon,
  FilterIcon2,
  SmallBackBtn,
  SortByIcon,
  SortByIcon2,
} from "../../util/icons";
import Link from "next/link";
import BottomFilters from "../../newComponents/BottomFilters";
import PropertyCard from "../../newComponents/PropertyCard";
import LoginPopup from "../../newComponents/LoginPopup";

const fetchCategoryData = async (slug) => {
  const baseUrl = `http://localhost:3000/api/getCategoryData`;
  try {
    const response = await fetch(`${baseUrl}?slug=${slug}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    console.log("me hu category data", result);
    return result;
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null;
  }
};

export async function getServerSideProps(context) {
  const { propid: slug } = context.params;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const blogs = await fetchCategoryData(slug);
  console.log(blogs);

  if (!blogs) {
    return {
      notFound: true,
    };
  }

  return {
    props: { blogs },
  };
}

const CategoryPage = ({ blogs }) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { categoryData, combinedProperties } = blogs || {};
  const [displayProperties, setDisplayProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [sortOption, setSortOption] = useState("cost-low-high");
  const initialCards = 3;
  const addedCards = 4;

  const states = [
    ...new Set(combinedProperties.map((prop) => prop.State).filter(Boolean)),
  ];
  const towns = [
    ...new Set(
      combinedProperties
        .filter((prop) => prop.State === selectedState)
        .map((prop) => prop.Town)
        .filter(Boolean)
    ),
  ];

  useEffect(() => {
    if (combinedProperties) {
      setFilteredProperties(combinedProperties);
      setDisplayProperties(combinedProperties.slice(0, initialCards));
    }
  }, [combinedProperties]);

  useEffect(() => {
    let filtered = combinedProperties;

    if (selectedState) {
      filtered = filtered.filter((prop) => prop.State === selectedState);
    }

    if (selectedTown) {
      filtered = filtered.filter((prop) => prop.Town === selectedTown);
    }

    if (sortOption === "cost-low-high") {
      filtered.sort((a, b) => (a.Cost || 0) - (b.Cost || 0));
    } else if (sortOption === "cost-high-low") {
      filtered.sort((a, b) => (b.Cost || 0) - (a.Cost || 0));
    } else if (sortOption === "guests-low-high") {
      filtered.sort((a, b) => (a.Guests || 0) - (b.Guests || 0));
    }

    setFilteredProperties(filtered);
    setDisplayProperties(filtered.slice(0, initialCards));
    setHasMore(filtered.length > initialCards);
  }, [selectedState, selectedTown, sortOption]);

  const loadMore = () => {
    const nextCards = filteredProperties.slice(
      displayProperties.length,
      displayProperties.length + addedCards
    );
    setDisplayProperties((prev) => [...prev, ...nextCards]);

    if (
      displayProperties.length + nextCards.length >=
      filteredProperties.length
    ) {
      setHasMore(false);
    }
  };

  const structure = {
    "@context": "http://schema.org",
    "@type": "Category",
    name: categoryData?.Title || "",
    url: `https://justhomestay.in/category/${categoryData?.slug || ""}`,
    logo: "https://justhomestay.in/logo_main.webp",
    image: categoryData?.Images?.[0]?.path
      ? `https://test.justhomestay.in/${categoryData.Images[0].path}`
      : "",
    description: categoryData?.Description || "",
    telephone: "+919810325245",
    email: "priyanshu@justhomestay.in",
  };

  if (!categoryData || !combinedProperties) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSortByPopup, setShowSortByPopup] = useState(false);

  const filterBtn = ["Premium", "Jacuzzi", "Pool"];

  return (
    <div className="flex justify-center">
      <Head>
        <title>
          {categoryData?.Title
            ? `${categoryData.Title} | Just Home Stay`
            : "Category"}
        </title>
        <meta name="description" content={categoryData?.Description || ""} />
        <meta property="og:title" content={categoryData?.Title || ""} />
        <meta
          property="og:image"
          content={
            categoryData?.Images?.[0]?.path
              ? `https://test.justhomestay.in/${categoryData.Images[0].path}`
              : ""
          }
        />
        <script
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON?.stringify(structure) }}
        />
      </Head>
      <div className="lg:w-[1140px] w-full px-4 md:px-0">
        <Header />
        <div className="lg:hidden mt-6 flex flex-col gap-6">
          <p className="flex  gap-2 text-light text-sm w-full items-center capitalize ">
            <Link href="/">home</Link>
            <span className="mt-1">
              <SmallBackBtn />
            </span>
            <Link href="/blogs">category</Link>
            <span className="mt-1">
              <SmallBackBtn />
            </span>
            <span>
              {categoryData?.Title.slice(0, 25) + "..." || "Category"}
            </span>
          </p>
          <div className="w-full flex items-center gap-2">
            <button onclick={() => setShowFilterPopup(true)}>
              <FilterIcon2 />
            </button>
            <div className="w-[1px] h-7 bg-light" />
            <div className="w-full flex items-center gap-2 scroll-smooth scroll-p-0 scroll-m-0 scroll_hide overflow-x-scroll">
              <button
                onclick={() => setShowSortByPopup(true)}
                className="flex items-center p-2 border border-dark rounded-lg"
              >
                <span>
                  <SortByIcon2 />
                </span>
                <span className="text-dark whitespace-nowrap">Sort by</span>
              </button>
              {filterBtn.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center p-2 border border-light rounded-lg"
                >
                  <span className="text-dark">{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:block hidden">
          <Heading heading={categoryData?.Title || "Category"} />
        </div>
        <div className="lg:hidden">
          <h1 className="font-semibold my-4 text-2xl text-normal">
            {categoryData?.Title || "Category"}
          </h1>
        </div>
        <div className="flex md:justify-between flex-wrap max-md:hidden">
          <div className="flex gap-4 my-4">
            <select
              className="p-2 border rounded"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded"
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">Select Town</option>
              {towns.map((town, index) => (
                <option key={index} value={town}>
                  {town}
                </option>
              ))}
            </select>
          </div>
          <select
            className="p-2 border rounded w-full"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="cost-low-high">Cost (Low to High)</option>
            <option value="cost-high-low">Cost (High to Low)</option>
            <option value="guests-low-high">Guests (Low to High)</option>
          </select>
        </div>

        <InfiniteScroll
          dataLength={displayProperties.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<ColorRing visible height={80} width={80} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-md:pb-28">
            {displayProperties.map((prop, index) => (
              // <PHCard key={index} property={prop} type={prop.Type} />
              <PropertyCard property={prop} type={prop.Type} key={index} setShowLoginPopup={setShowLoginPopup} />
            ))}
          </div>
        </InfiniteScroll>
        {/* <Bottombar /> */}

        {/* bottom footer or filters */}
        <BottomFilters
          setShowFilterPopup={setShowFilterPopup}
          setShowSortByPopup={setShowSortByPopup}
        />
        <div className="lg:block hidden">
          <Footer />
        </div>
        <BackToTop />
      </div>
      {showFilterPopup && (
        <FilterPopup
          setShowFilterPopup={setShowFilterPopup}
          showFilterPopup={showFilterPopup}
        />
      )}
      {showSortByPopup && (
        <SortByPopup
          showSortByPopup={showSortByPopup}
          setShowSortByPopup={setShowSortByPopup}
          setSortOption={setSortOption}
        />
      )}
      {showLoginPopup && (
        <LoginPopup
          setShowLoginPopup={setShowLoginPopup}
          showLoginPopup={showLoginPopup}
        />
      )}
    </div>
  );
};

export default CategoryPage;
