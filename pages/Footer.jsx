import Image from "next/image";
import { Section, Container } from "../newComponents/SectionComponents";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FillFacebookIcon,
  FillInstagramIcon,
  FillLinkedinIcon,
} from "../util/icons";
const Footer = () => {
  const [topLocations, setTopLocations] = useState([]);

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
      icon: <FillFacebookIcon />,
      link: "https://www.facebook.com/justhomestay.in/",
    },
    {
      icon: <FillInstagramIcon />,
      link: "https://www.instagram.com/justhomestay.in/",
    },
    {
      icon: <FillLinkedinIcon />,
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

  const listData = [
    {
      title: "Top Collections",
      data: collectionLinks,
    },
    {
      title: "Important Links",
      data: importantLinks,
    },
    {
      title: "Top locations",
      data: (topLocations || []).map(({ Town }) => {
        return {
          text: `${Town}`,
          link: `/location/${Town}`,
        };
      }),
    },
    {
      title: "Contact Details",
      data: [
        {
          text: "363A, Lane No. 5, Chankya Marg, Subash Nagar, Dehradun, Uttarakhand 248001",
          link: "",
        },
        {
          text: "+91 9810325245",
          link: "tel:+91 9810325245",
        },
        {
          text: "info@justhomestay",
          link: "mailto:info@justhomestay",
        },
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F5F5]">
      <Container>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 items-center py-8">
          <div className="relative aspect-[4/1] h-[5rem] col-span-1">
            <Image
              src="/logo_main.webp"
              alt="just home stay"
              fill
              className="object-contain"
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-light text-base">
              Just Home Stay offers cozy to luxury vacation rentals across
              India, with a focus on safety, sustainability, and seamless
              booking. Enjoy 24/7 support and competitive prices for an
              unforgettable experience.
            </h2>
          </div>
        </div>
      </Container>
      <hr className="w-full bg-light" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {listData?.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h2 className="text-dark text-lg font-bold">{item.title}</h2>
                <ul className="flex flex-col gap-2">
                  {item.data?.map((data, index) => (
                    <li className="" key={index}>
                      <Link href={data.link} className="text-normal">
                        {data.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <hr className="my-8 w-full bg-light" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base text-dark">
                © {currentYear} Just Homestay
              </span>
              <span className="text-base text-dark">•</span>
              <span className="text-base text-dark">All Rights Reserved</span>
              <span className="text-base text-dark">•</span>
              <span className="text-base text-dark">
                Designed & Developed by
              </span>
              <Link
                href="https://www.eazotel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-dark font-semibold"
              >
                Eazotel
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {socialMediaLinks?.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-dark p-2 text-white hover:text-dark hover:bg-white border border-dark rounded-sm"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;
