import React from "react";
import LCard from "./locationCard";
import axios from "axios";
import Header from "./header";
import Footer from "./Footer.jsx";
import Heading from "./headings";

const AllLocationsPage = ({ loc }) => {
  const sendEvent = (town) => {
    window.gtag("event", "location_clicked", {
      event_category: "Conversion",
      event_label: "User clicked on a location",
      location_name: town,
    });
  };

  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full md:px-0 px-4">
        <Header />
        <div className="flex justify-center">
          <div className="flex flex-col justify-center items-center max-w-screen-xl p-2 md:p-4 text-right w-screen md:w-full bottom-0 md:bottom-auto ">
            <Heading heading={"All Locations"} />
            <div className="grid md:grid-cols-6 grid-cols-2 gap-y-2 mt-4 overflow-y-auto ">
              {loc &&
                loc.map((lc, index) => (
                  <div key={index} className="grid col-span-1">
                    <a
                      onClick={() => sendEvent(lc.Town)}
                      className="cursor-pointer"
                      href={"/location/" + lc.Town}
                    >
                      <LCard
                        image={
                          "https://test.justhomestay.in/" + lc.Image[0].path
                        }
                        state={lc.State}
                        location={lc.Town}
                        number={Number(lc.CountSV) + Number(lc.CountJHS)}
                        alt={lc.Town + " | " + lc.State + " | Just Home Stay"}
                      />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AllLocationsPage;

export async function getServerSideProps() {
  const res = await axios.get(process.env.API_URL + "Location", {
    headers: {
      "xc-token": process.env.API_KEY,
    },
    params: {
      limit: "100",
      where: "(TotalCount,gt,0)",
      sort: "-TotalCount",
      fields: "Image,Town,State,CountSV,CountJHS",
    },
  });
  const loc = res.data.list;

  return {
    props: { loc },
  };
}
