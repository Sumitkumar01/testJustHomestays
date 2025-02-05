import React, { useState, useEffect, useContext, useRef } from "react";
import Header from "../header";
import Footer from "../Footer.jsx";
import PHCard from "../propCard";
import Breadcrumb from "../breadcrumb";
import Topbar from "./topbar";
import * as _ from "lodash";
import axios from "axios";
import PDCard from "./PCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { ColorRing } from "react-loader-spinner";
import Bottombar from "../bottomBar";
import RangeSlider from "react-range-slider-input/dist/components/RangeSlider";
import { MultiplierContext } from "../../contexts/MultiplierContext";
import { BsChevronDown, BsChevronUp, BsXLg } from "react-icons/bs";
import Head from "next/head";
import { useRouter } from "next/router";
import BackToTop from "../backtoptop";
import { useSwipeable } from "react-swipeable";
import { capitalCase } from "change-case";
import LocationNavbar from "../../newComponents/LocationNavbar";
import BottomFilters from "../../newComponents/BottomFilters";
import FilterPopup from "../../newComponents/FilterPopup";
import SortByPopup from "../../newComponents/SortByPopup";
import { FilterIcon2, SmallBackBtn, SortByIcon2 } from "../../util/icons";
import Link from "next/link";
import SearchByProperty from "../../newComponents/SearchByProperty";

async function fetchData(slug) {
  if (slug) {
    console.log(slug);
    try {
      let response = await fetch(
        // `${process.env.API_URL}Location?where=(Town,eq,${slug})`,
        `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Location?where=(Town,eq,${slug})`,
        {
          headers: {
            // "xc-token": process.env.API_KEY,
            "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
          },
        }
      );
      let data = await response.json();

      return data.list.length > 0 ? data.list[0] : null;
    } catch (error) {
      console.error("Fetching data failed", error);
      return null;
    }
  }
}

async function fetchLocationSlugs() {
  let slugs = [];
  const limit = 1000;
  try {
    const response = await fetch(
      // `${process.env.API_URL}Location?limit=${limit}`,
      `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Location?limit=${limit}`,
      {
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    slugs = slugs.concat(data.list.map((location) => location.Town));
    return slugs;
  } catch {
    console.error("Fetching property slugs failed", error);
    return [];
  }
}

export async function getStaticProps({ params }) {
  const blogs = await fetchData(params.propid);
  if (!blogs) {
    return { notFound: true };
  }
  return { props: { blogs }, revalidate: 24 * 60 * 60 };
}

export async function getStaticPaths() {
  const slugs = await fetchLocationSlugs();
  const paths = slugs.map((slug) => ({ params: { propid: slug } }));
  return { paths, fallback: "blocking" };
}

const Property = ({ blogs }) => {
  var id = blogs.Town;
  const town = capitalCase(blogs.Town);
  const state = capitalCase(blogs.State);
  const multiplier = useContext(MultiplierContext);
  const [blogs3, setProp3] = useState([]);
  const [sdate, setsDate] = useState(null);
  const [edate, seteDate] = useState(null);
  const [adult, setAdult] = useState(null);
  const [child, setChild] = useState(null);
  const [total, setTotal] = useState(0);
  const [lvalue, setLvalue] = useState(0);
  const [uvalue, setUvalue] = useState(0);
  const [lvalue2, setLValue2] = useState(0);
  const [uvalue2, setUValue2] = useState(0);
  const [lft, setLft] = useState(0);
  const [uft, setUft] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [displayProperties, setDisplayProperties] = useState([]);
  const [minAge, setminAge] = useState(0);
  const [maxAge, setmaxAge] = useState(0);
  const [bedroomCount, setBedroomCount] = useState(null);
  const [distinctBedroomCounts, setDistinctBedroomCounts] = useState([]);
  const [sortMethod, setSortMethod] = useState("CostAsc");
  const [filterModal, setfilterModal] = useState(false);
  const [sortModal, setsortModal] = useState(false);
  const [propType, setpropType] = useState("All");
  const router = useRouter();
  const displayPropertiesLengthRef = useRef(displayProperties.length);
  const [instantbooking, setInstantbooking] = useState(false);

  const [selectedAmen, setSelectedAmen] = useState([]);

  const amenities = [
    "Wheelchair Accessibility",
    "Pets Allowed",
    "Hot Tub",
    "Pool",
    "Kitchen",
    "Indoor Fireplace",
    "Coffee Maker",
    "Bonfire",
    "WiFi",
    "Free Parking on Premises",
    "Cooking Utensils",
    "Private Entrance",
    "Barbeque Grill",
    "Mountain View",
    "Patio",
  ];

  useEffect(() => {
    displayPropertiesLengthRef.current = displayProperties.length;
  }, [displayProperties]);

  useEffect(() => {
    const qPam = new URLSearchParams(window.location.search);
    if (qPam.get("startDate") != null) {
      setsDate(qPam.get("startDate"));
    }
    if (qPam.get("endDate") != null) {
      seteDate(qPam.get("endDate"));
    }
    setAdult(Number(qPam.get("adult")));
    setChild(Number(qPam.get("child")));
    getData();
  }, []);

  useEffect(() => {
    if (blogs3.length > 0) {
      const filteredBlogs =
        propType !== "All"
          ? _.filter(blogs3, (pr) => pr["PropertyType"] === propType)
          : blogs3;

      if (propType === "All") {
        setTotal(adult + child);
      }

      const calculateCostsPerNight = (blogs) =>
        blogs.map((pr) => {
          const costPerNight =
            pr["Type"] === "SV"
              ? Number(pr["Cost per Night"]) * multiplier
              : Number(pr["Cost per Night"]);
          return Number.isFinite(costPerNight) ? costPerNight : NaN;
        });

      const calculateTotalGuests = (blogs) =>
        blogs.map((pr) => Number(pr["Total Guests"]));

      const calculateBedroomCounts = (blogs) =>
        blogs.map((pr) => Number(pr["Number of Bedrooms"]));

      const costsPerNight = calculateCostsPerNight(filteredBlogs);

      // Filter out NaN values
      const validCostsPerNight = costsPerNight.filter(Number.isFinite);

      const totalGuests = calculateTotalGuests(filteredBlogs);
      const allBedroomCounts = calculateBedroomCounts(filteredBlogs);

      // Only perform Math.min and Math.max on valid costs
      setLvalue(Math.min(...validCostsPerNight));
      setUvalue(Math.max(...validCostsPerNight));
      setLValue2(Math.min(...validCostsPerNight));
      setUValue2(Math.max(...validCostsPerNight));
      setLft(Math.min(...totalGuests));
      setUft(Math.max(...totalGuests));
      setminAge(Math.min(...totalGuests));
      setmaxAge(Math.max(...totalGuests));

      const distinct = [...new Set(allBedroomCounts)];
      setDistinctBedroomCounts(_.sortBy(distinct));
    }
  }, [blogs3, propType, adult, child]);

  function getCost(pr) {
    const baseCost = Number(pr["Cost per Night"]);
    return pr.Type === "SV" ? baseCost * multiplier : baseCost;
  }

  useEffect(() => {
    const updateDisplayProperties = () => {
      let sorted;

      // Filter
      const filtered = blogs3.filter((pr) => {
        const cost = getCost(pr);
        const guests = Number(pr["Total Guests"]);
        const bedrooms = Number(pr["Number of Bedrooms"]);
        const propertyType = pr["PropertyType"];
        const instantBookingAvailable = pr["Instant Booking"];
        const amenArr = pr.Amenity || [];
        const amenArrName = amenArr.map((amen) => amen.Name);
        const costCondition =
          (lvalue === 0 && uvalue === 0) || (cost >= lvalue && cost <= uvalue);
        const propCondition =
          propType === "All" ||
          (propType === "entire place" && propertyType === "entire place") ||
          (propType === "private room" && propertyType === "private room");
        const guestsCondition =
          total > 0
            ? guests >= total
            : (uft === 0 && lft === 0) || (guests >= lft && guests <= uft);
        const bedroomCondition =
          bedroomCount === null || bedrooms === Number(bedroomCount);
        const instantBookingCondition = instantbooking
          ? instantBookingAvailable
          : true;

        const amen =
          selectedAmen.length === 0 ||
          selectedAmen.every((amen) => amenArrName.includes(amen));

        return (
          costCondition &&
          guestsCondition &&
          bedroomCondition &&
          propCondition &&
          instantBookingCondition &&
          amen
        );
      });

      // Sorting
      switch (sortMethod) {
        case "CostAsc":
          sorted = _.orderBy(filtered, [getCost], ["asc"]);
          break;
        case "CostDesc":
          sorted = _.orderBy(filtered, [getCost], ["desc"]);
          break;
        default:
          sorted = _.orderBy(filtered, [getCost], ["asc"]);
          break;
      }

      setDisplayProperties(sorted);
    };

    updateDisplayProperties();
    setVisibleCards(3);
  }, [
    blogs3,
    lvalue,
    uvalue,
    lft,
    uft,
    total,
    adult,
    child,
    bedroomCount,
    multiplier,
    sortMethod,
    propType,
    instantbooking,
    selectedAmen,
  ]);

  const handleChange = (e) => {
    setLvalue(e[0]);
    setUvalue(e[1]);
  };

  const handleChange2 = (e) => {
    setLft(Number(e[0]));
    setUft(Number(e[1]));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadMoreItems();
    }, 2000); // Load more items every 2 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [visibleCards, displayProperties]);

  const loadMoreItems = () => {
    if (visibleCards < displayProperties.length) {
      setVisibleCards((prevVisibleCards) => prevVisibleCards + 3);
    }
  };

  const getData = async () => {
    try {
      const options1 = {
        method: "GET",
        // url: process.env.API_URL + "Property/views/listingStatus",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property/views/listingStatus",
        params: {
          limit: "1000",
          where: `(Town,like,${id})`,
          fields:
            "Type,Title,Town,State,Number of Bedrooms,Cost per Night,Total Guests,Number of Bathrooms,Pets Allowed,Instant Booking,PID,ncRecordId,PropertyType,Amenity",
        },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      const options2 = {
        method: "GET",
        // url: process.env.API_URL + "StayVista/views/listingStatus",
        url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/StayVista/views/listingStatus",
        params: {
          limit: "1000",
          where: `(Town,like,${id})`,
          fields:
            "Title,Type,Town,State,Number of Bedrooms,Cost per Night,Total Guests,Number of Bathrooms,Pets Allowed,Instant Booking,PID,PropertyType,Id,Amenity",
        },
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      };

      const [response1, response2] = await Promise.all([
        axios.request(options1),
        axios.request(options2),
      ]);

      newList(response1.data.list, response2.data.list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function newList(t1, t2) {
    const newBlogs = [...t1, ...t2];
    setProp3(newBlogs);
  }

  const resetPrice = () => {
    setLvalue(lvalue2);
    setUvalue(uvalue2);
  };

  const resetGuests = () => {
    setLft(minAge);
    setUft(maxAge);
  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      setfilterModal(false);
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleAmen = (e) => {
    if (selectedAmen.includes(e)) {
      let arr = selectedAmen;
      let i1 = arr.indexOf(e);
      let i2 = selectedAmen.indexOf(e);
      arr.splice(i1, 1);
      setSelectedAmen([...arr]);
    } else {
      setSelectedAmen((prev) => [...prev, e]);
    }
  };

  const structure = {
    "@context": "http://schema.org",
    "@type": "Category",
    name: `${blogs.Town}, ${blogs.State}`,
    url: `https://justhomestay.in${router.pathname}`,
    logo: `https://justhomestay.in/logo_main.webp`,
    image: `https://test.justhomestay.in/${blogs.Image[0].path}`,
    description: `Get your home away from home at ${blogs.Town} in ${blogs.State} with Just Home Stay. Get access to top luxury homestays and villas, Book now!`,
    telephone: "+919810325245",
    email: "priyanshu@justhomestay.in",
  };

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSortByPopup, setShowSortByPopup] = useState(false);
  const [showSearchByProperty, setShowSearchByProperty] = useState(false);
  const filterBtn = ["Premium", "Jacuzzi", "Pool"];

  if (blogs3.length) {
    return (
      <div className="flex flex-col justify-center mx-auto">
        <Head>
          <title>{`Top Homestays at ${town} | Just Home Stay`}</title>
          <meta
            name="description"
            content={`Get your home away from home at ${town} in ${state} with Just Home Stay. Get access to top luxury homestays and villas, Book now!`}
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            property="og:title"
            content={`Top Homestays at ${town} | Just Home Stay`}
          />
          <meta
            property="og:description"
            content={`Get your home away from home at ${town} in ${state} with Just Home Stay. Get access to top luxury homestays and villas, Book now!`}
          />
          <meta
            property="og:url"
            content={`https://justhomestay.in${router.pathname}`}
          />
          <meta
            property="og:image"
            content={`https://test.justhomestay.in/${blogs.Image[0].path}`}
          />
          <link
            rel="canonical"
            href={`https://justhomestay.in${router.pathname}`}
          />
          <script
            key="structure"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON?.stringify(structure) }}
          />
        </Head>
        <div className="lg:hidden">
          <LocationNavbar
            locationName={blogs.Town}
            setShowSearchByProperty={setShowSearchByProperty}
          />
        </div>
        <div className="lg:w-[1140px] mx-auto w-full md:px-0 px-4">
          <div className="lg:hidden mt-6 flex flex-col gap-6">
            <p className="flex  gap-2 text-light text-sm w-full items-center ">
              <Link href="/">Home</Link>
              <span className="mt-1">
                <SmallBackBtn />
              </span>

              <span className="">Properties in</span>
              <span>{blogs.Town}</span>
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
            <Header />
            <Breadcrumb location={town} state={state} />

            <Topbar
              town={town}
              state={state}
              adult={adult}
              child={child}
              sdate={sdate}
              edate={edate}
              ffmodal={filterModal}
              sfmodal={sortModal}
              fmodal={setfilterModal}
              smodal={setsortModal}
            />
          </div>
          <div
            className={`backdrop justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none ${
              filterModal ? `flex` : `hidden`
            }`}
          >
            <div className="md:modal-box md:max-w-screen-md max-w-full w-full md:h-[70vh] h-[80vh] md:p-4 p-2 text-right bg-base-100 fixed md:relative bottom-0 overflow-y-auto">
              <div className=" justify-end hidden md:flex">
                <button
                  className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center "
                  onClick={() => setfilterModal(false)}
                >
                  <BsXLg className="h-6 w-6" />
                </button>
              </div>
              <div
                {...handlers}
                className="p-1 w-full justify-center mx-auto block md:hidden pb-2"
              >
                <div className="h-2 w-36 bg-neutral rounded-full mx-auto"></div>
              </div>
              <p className="font-bold text-center text-lg mb-4">Filters</p>
              <div className="overflow-y-auto p-4 h-full md:text-left text-center">
                {propType != "All" ||
                instantbooking ||
                lvalue != lvalue2 ||
                uvalue != uvalue2 ||
                lft != minAge ||
                uft != maxAge ||
                bedroomCount ? (
                  <p>{`Showing ${
                    propType === "private room"
                      ? `Private Rooms`
                      : `Entire Homestays`
                  } in ${town} for upto ${uft} guests ranging between ₹${lvalue} & ₹${uvalue} ${
                    bedroomCount ? `having ${bedroomCount} rooms` : ``
                  }${instantbooking ? ` looking to Book Now` : ``}`}</p>
                ) : (
                  <p>Showing all properties</p>
                )}
                <div className="flex justify-between pt-4">
                  <p className="my-auto text-left font-bold text-xl">
                    Instant Booking only?
                  </p>
                  <div className="flex">
                    <div
                      onClick={() => setInstantbooking(true)}
                      className={`md:px-8 px-4 py-4 rounded-l-xl cursor-pointer ${
                        instantbooking
                          ? `bg-slate-600 shadow-inner text-white font-bold`
                          : `bg-slate-300`
                      }`}
                    >
                      Yes
                    </div>
                    <div
                      onClick={() => setInstantbooking(false)}
                      className={`md:px-8 px-4 py-4 rounded-r-xl cursor-pointer ${
                        !instantbooking
                          ? `bg-slate-600 shadow-inner text-white font-bold`
                          : `bg-slate-300`
                      }`}
                    >
                      No
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="mb-2 text-left font-bold text-xl">
                    Property Type
                  </p>
                  <p className="text-left mb-4">
                    Browse rooms, homes and more.
                  </p>
                  {blogs3.length >= 0 ? (
                    <div className="mb-4">
                      <div className="flex flex-row md:w-max w-full">
                        <div
                          onClick={() => setpropType("All")}
                          className={`md:px-8 px-4 py-4 rounded-l-xl cursor-pointer ${
                            propType === "All"
                              ? `bg-slate-600 shadow-inner text-white font-bold`
                              : `bg-slate-300`
                          }`}
                        >
                          All Properties
                        </div>
                        <div
                          onClick={() => setpropType("private room")}
                          className={`md:px-8 px-4 py-4 cursor-pointer ${
                            propType === "private room"
                              ? `bg-slate-600 shadow-inner text-white font-bold`
                              : `bg-slate-300`
                          }`}
                        >
                          Private Room
                        </div>
                        <div
                          onClick={() => setpropType("entire place")}
                          className={`md:px-8 px-4 py-4 rounded-r-xl cursor-pointer ${
                            propType === "entire place"
                              ? `bg-slate-600 shadow-inner text-white font-bold`
                              : `bg-slate-300`
                          }`}
                        >
                          Entire Home
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Loading</p>
                  )}
                </div>
                {lvalue && uvalue ? (
                  <div className="pt-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-left text-xl font-bold">{`Price Range: ₹${lvalue} - ₹${uvalue}`}</p>
                      {lvalue != lvalue2 || uvalue != uvalue2 ? (
                        <button className="link" onClick={() => resetPrice()}>
                          Clear
                        </button>
                      ) : null}
                    </div>
                    <p className="text-left mb-4">Homestays for every budget</p>
                    <RangeSlider
                      name="pricefilter"
                      id="pricefilter"
                      min={lvalue2}
                      max={uvalue2}
                      step={500}
                      defaultValue={[lvalue2, uvalue2]}
                      onInput={(e) => handleChange(e)}
                      value={[lvalue, uvalue]}
                    />

                    <div className="flex w-full justify-between mt-4">
                      <p>{`₹${lvalue2}`}</p>
                      <p>{`₹${uvalue2}`}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading</p>
                )}
                {minAge && maxAge ? (
                  <div className="pt-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-left text-xl font-bold">{`No. of Guests: ${lft} - ${uft}`}</p>
                      {lft != minAge || uft != maxAge ? (
                        <button className="link" onClick={() => resetGuests()}>
                          Clear
                        </button>
                      ) : null}
                    </div>
                    <p className="text-left mb-4">
                      Homestays for couples, families, and more...
                    </p>
                    <RangeSlider
                      name="guestfilter"
                      id="guestfilter"
                      min={minAge}
                      max={maxAge}
                      step={1}
                      defaultValue={[minAge, maxAge]}
                      value={[lft, uft]}
                      onInput={(e) => handleChange2(e)}
                    />

                    <div className="flex w-full justify-between mt-4">
                      <p>{minAge}</p>
                      <p>{maxAge}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="pt-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-left text-xl font-bold">{`No. of Bedrooms: ${
                      bedroomCount ? bedroomCount : ""
                    }`}</p>
                    {bedroomCount ? (
                      <button
                        className="link"
                        onClick={() => setBedroomCount(null)}
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {distinctBedroomCounts.length &&
                    distinctBedroomCounts.map((bc, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setBedroomCount(bc);
                        }}
                        className={`btn md:px-6 px-4 py-2 ${
                          bedroomCount === bc ? `btn-primary` : `btn-neutral`
                        } text-center p-1 cursor-pointer`}
                      >
                        <p>{bc}</p>
                      </button>
                    ))}
                </div>
                <div className="pt-6">
                  <div className="flex justify-between mb-2">
                    <p className="text-left text-xl font-bold">{`Top Amenities:`}</p>
                    {selectedAmen ? (
                      <button
                        className="link"
                        onClick={() => setSelectedAmen([])}
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {amenities.length &&
                    amenities.map((bc, index) => (
                      <div
                        key={index}
                        onClick={() => handleAmen(bc)}
                        className={`btn md:px-6 px-4 py-2 ${
                          selectedAmen.includes(bc)
                            ? `btn-primary`
                            : `btn-secondary`
                        } text-center p-1 cursor-pointer`}
                      >
                        <p>{bc}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`backdrop justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none ${
              sortModal ? `flex` : `hidden`
            }`}
          >
            <div className="modal-box max-w-screen-sm p-4 text-right">
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
                  onClick={() => setsortModal(false)}
                >
                  <BsXLg className="h-6 w-6" />
                </button>
              </div>
              <button
                className="w-full text-left p-1 cursor-pointer"
                onClick={() => setSortMethod("CostAsc")}
              >
                <p className="flex gap-x-2 items-center">
                  Price - Low to High{" "}
                  {sortMethod === "CostAsc" && <BsChevronUp />}
                </p>
              </button>
              <button
                className="w-full text-left p-1 cursor-pointer"
                onClick={() => setSortMethod("CostDesc")}
              >
                <p className="flex gap-x-2 items-center">
                  Price - High to Low{" "}
                  {sortMethod === "CostDesc" && <BsChevronDown />}
                </p>
              </button>
            </div>
          </div>
          <div>
            <InfiniteScroll
              dataLength={visibleCards}
              next={() =>
                setVisibleCards((prevVisibleCards) => prevVisibleCards + 4)
              }
              hasMore={visibleCards < displayProperties.length}
              loader={
                <div className="w-full mx-auto text-center iconcen">
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#0C5110",
                      "#E8BF29",
                      "#FCF8E9",
                      "#E8BF29",
                      "#0C5110",
                    ]}
                  />
                </div>
              }
              scrollThreshold={0.8}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-x-2 gap-y-4 my-4 px-2 lg:px-0">
                {displayProperties.slice(0, visibleCards).map((prop, index) => {
                  return (
                    <div
                      className="hidden-if-empty grid col-span-1"
                      key={`${prop["PID"]}-${index}`}
                    >
                      {sdate != "null" && edate != "null" && total > 0 ? (
                        <PDCard
                          uid={prop["PID"]}
                          startDate={sdate}
                          endDate={edate}
                          adult={adult}
                          child={child}
                          calendar={prop["Calendar ID"]}
                          type={prop.Type}
                        />
                      ) : (
                        <PHCard key={index} property={prop} type={prop.Type} />
                      )}
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
          {/* <Bottombar /> */}
          {/* bottom footer or filters */}
          <BottomFilters
            setShowFilterPopup={setShowFilterPopup}
            setShowSortByPopup={setShowSortByPopup}
          />
          <div className="hidden lg:block">
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
          />
        )}

        {showSearchByProperty && (
          <SearchByProperty
            showSearchByProperty={showSearchByProperty}
            setShowSearchByProperty={setShowSearchByProperty}
          />
        )}
      </div>
    );
  }
};

export default React.memo(Property);
