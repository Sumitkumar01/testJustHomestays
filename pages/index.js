import Header from "./header";
import Hero from "./hero";
import Heading from "./headings";
import DCarousel from "./destinationCarousel";
import TLocation from "./tabLocations";
import Categories from "./categories";
import Testimonials from "./testimonials";
// import Footer from "./Footer.jsx";
import Footer from "./Footer.jsx";
import Head from "next/head";
import BackToTop from "./backtoptop";
import BottomFooter from "../newComponents/BottomFooter";
import OurServiceGlance from "../newComponents/OurServiceGlance";
import PopularDestination from "../newComponents/PopularDestination";
import ExploreCategories from "../newComponents/ExploreCategories";
import RecommendedProperties from "../newComponents/RecommendedProperties";
import SearchByProperty from "../newComponents/SearchByProperty";
import { SearchIcon1 } from "../util/icons";
import { useState } from "react";
import LoginPopup from "../newComponents/LoginPopup";

export default function Home() {
  const structure = {
    "@context": "http://schema.org",
    "@type": "TravelAgency",
    name: "JustHomestay",
    url: "https://justhomestay.in/",
    logo: "https://justhomestay.in/logo_main.webp",
    sameAs: [
      "https://www.facebook.com/justhomestay.in/",
      "https://www.instagram.com/justhomestay.in/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919810325245",
      contactType: "customer service",
    },
  };

  const [showSearchByProperty, setShowSearchByProperty] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <div className="flex justify-center">
      <Head>
        <meta charSet="UTF-8" />
        <script
          key="structure"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON?.stringify(structure) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://justhomestay.in/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Luxury Homestays | Explore Local Living | Just Home Stay"
        />
        <meta
          property="og:description"
          content="Discover your home away from home with Just Home Stay. Offering a range of quality homestays in India. Book now for a memorable stay."
        />
        <meta property="og:url" content="https://justhomestay.in/" />
        <meta
          property="og:image"
          content="https://justhomestay.in/main_mobile.webp"
        />
        <meta property="og:site_name" content="JustHomestay" />
        <title>{`Luxury Homestays | Explore Local Living | Just Home Stay`}</title>
        <meta
          name="description"
          content={`Discover your home away from home with Just Home Stay. Offering a range of quality homestays in India. Book now for a memorable stay.`}
        />
      </Head>
      <div className="max-w-[1600px] mx-auto w-full max-md:pb-28">
        <Header className="basis-full" />
        <Hero className="basis-full" />
        <div className="hidden">
          <Heading heading={"Pick a Destination"} />
          <DCarousel />
          <Heading heading={"Trending this Season"} />
          <TLocation setShowLoginPopup={setShowLoginPopup} />
          <Heading heading={"Your Favorite Categories"} />
          <Categories />
        </div>
        <div className="lg:hidden block">
          <div className="px-4 pt-6">
            <button
              onClick={() => setShowSearchByProperty(true)}
              className="border-light text-light rounded-full gap-2 border py-4 px-6 w-full flex items-center"
            >
              <span className="">
                <SearchIcon1 />
              </span>
              <span className="">Search by Property</span>
            </button>
          </div>
        </div>
          <PopularDestination />
          <ExploreCategories />
          <RecommendedProperties setShowLoginPopup={setShowLoginPopup} />
          {/* <TLocation /> */}
        <OurServiceGlance />
        {/* <div className="lg:block hidden">
          <Heading heading={"What People Say?"} />
        </div> */}
        <div className="lg:hidden block px-4 mt-4 -mb-3">
          <h2 className="text-2xl text-normal font-semibold">Testimonials</h2>
        </div>
        <Testimonials />
        {/* <Bottombar /> */}
        <BottomFooter />
        <div className="lg:block hidden">
          <Footer />
        </div>
        <BackToTop />
      </div>
      {showSearchByProperty && (
        <SearchByProperty
          showSearchByProperty={showSearchByProperty}
          setShowSearchByProperty={setShowSearchByProperty}
        />
      )}
      {showLoginPopup && (
        <LoginPopup
          showLoginPopup={showLoginPopup}
          setShowLoginPopup={setShowLoginPopup}
        />
      )}
    </div>
  );
}
