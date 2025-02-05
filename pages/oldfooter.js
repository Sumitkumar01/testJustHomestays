import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../public/logo_main.webp";
import { useState, useEffect } from "react";
import axios from "axios";

const Footer = () => {
  const [symbol, setSymbol] = useState(false);
  const [topLocations, setTopLocations] = useState([]);

  const handleSymbol = () => setSymbol(!symbol);

  const getData = async () => {
    const res = await axios.get(process.env.API_URL + "Location", {
      headers: {
        "xc-token": process.env.API_KEY,
      },
      params: {
        limit: "100",
        where: "(Footer,eq,true)",
      },
    });
    setTopLocations(res.data.list);
  };

  const socialMediaLinks = [
    {
      icon: <FaFacebookF />,
      link: "https://www.facebook.com/justhomestay.in/",
    },
    {
      icon: <FaInstagram />,
      link: "https://www.instagram.com/justhomestay.in/",
    },
    {
      icon: <FaLinkedinIn />,
      link: "https://www.linkedin.com/company/justhomestay/",
    },
  ];

  const importantLinks = [
    { text: "Cancellation Policy", link: "/cancellation-policy" },
    { text: "Terms & Conditions", link: "/terms-and-conditions" },
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "List your Home", link: "/partner-with-us" },
    { text: "Contact Us", link: "/contact-us" },
    { text: "Accounts", link: "/user/Accounts" },
    { text: "Wishlist", link: "/wishlist" },
    { text: "All Locations", link: "/locations" },
    { text: "Blogs", link: "/blogs" },
  ];

  const collectionLinks = [
    { text: "Pet-Friendly Villas", link: "/category/pet-friendly-villas" },
    { text: "Top Pool Collection", link: "/category/top-pool-collection" },
    { text: "Mountain Calling", link: "/category/mountain-collection" },
    { text: "Beach Collection", link: "/category/beach-collection" },
    { text: "Large Group Villa", link: "/category/large-group-villa" },
    { text: "Getaway Collection", link: "/category/gateway-collection" },
    { text: "JHS Favourites", link: "/category/JHS-Favourites" },
    {
      text: "Just Homestay Top Rated",
      link: "/category/Just-Homestay-Top-Rated",
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <footer className="bg-white p-4 my-8 relative overflow-hidden rounded-xl drop-shadow-xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center md:col-span-2">
            <a href="/">
              <Image
                src={logo}
                width={400}
                height={400}
                className="md:w-1/2 w-2/3 mx-auto"
                alt="Just Home Stay Logo"
              />
            </a>
            <div onClick={() => handleSymbol()} className="collapse">
              <input type="checkbox" />
              <div className="collapse-title text-sm mt-2 pr-4 font-bold">
                About Just Home Stay{" " + (symbol ? "-" : "+")}
              </div>
              <div className="collapse-content text-sm mt-2">
                Discover the comfort of home while exploring India's rich
                cultural tapestry with Just Home Stay. We curate a diverse range
                of private vacation rentals, from luxurious villas to cozy
                apartments, in prime locations across India. Unravel unique
                local experiences, secure in the knowledge of our stringent
                safety and hygiene measures. Enjoy 24/7 customer support,
                competitive pricing, and a seamless online booking experience.
                As a champion of sustainable tourism, we promote eco-friendly
                practices to enhance your stay while respecting the environment.
                With Just Home Stay, your unforgettable vacation is just a click
                away.
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              {socialMediaLinks.map(({ icon, link }, index) => (
                <a
                  key={index}
                  href={link}
                  className="text-2xl hover:text-primary"
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <p id="address">
                <span className="font-bold">Just Homestay</span>
                <br />
                <span>363A, Lane No. 5</span>
                <br />
                <span>Chankya Marg, Subash Nagar</span>
                <br />
                <span>Dehradun, Uttarakhand 248001</span>
              </p>
            </div>
          </div>
          <div className="text-center">
            <h5 className="text-lg font-semibold mb-4">Top Collections</h5>
            <ul className="text-sm space-y-2">
              {collectionLinks.map(({ text, link }, index) => (
                <li key={index}>
                  <a href={link} className="hover:text-gray-300">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <h5 className="text-lg font-semibold mb-4">Important Links</h5>
            <ul className="text-sm space-y-2">
              {importantLinks.map(({ text, link }, index) => (
                <li key={index}>
                  <a href={link} className="hover:text-gray-300">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <h5 className="text-lg font-semibold mb-4">Featured Locations</h5>
            <ul className="text-sm space-y-2">
              {topLocations.map(({ Town }, index) => (
                <li key={index}>
                  <a href={`/location/${Town}`} className="hover:text-gray-300">
                    {Town}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-sm mt-6 md:mt-12 mb-6 md:mb-0">
          <p>
            © {new Date().getFullYear()} JustHomeStay. All rights reserved.
            <br /> Made with ♡ by{" "}
            <a href="https://www.crisscrosslab.com/">CCL</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
