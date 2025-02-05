import axios from "axios";
import { useState } from "react";
import Header from "./header";
import Footer from "./Footer.jsx";
import Image from "next/image";
import mainimage from "../public/partner-with-us.webp";
import image2 from "../public/homestay_image.webp";
import { CheckPointIcon, VerifiedIcon } from "../util/icons";
import Link from "next/link";
import ListYourPropertyForm from "../newComponents/ListYourPropertyForm";

const PartnerWithUs = () => {
  const [form, setForm] = useState({
    Name: "",
    "Email ID": "",
    Mobile: "",
    City: "",
    Type: "",
    Description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axios.post(
        "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/ListVilla",
        form,
        {
          headers: {
            "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
          },
        }
      );
      await axios.post("api/sendPEmail", form);
      alert("Successfully submitted");
      setForm({
        Name: "",
        "Email ID": "",
        Mobile: "",
        City: "",
        Type: "",
        Description: "",
      });
      setErrors({});
    } catch (error) {
      alert("Error in submission");
    }
  };

  const data = [
    {
      id: 1,
      title: "Monetise Your Home",
      desc: [
        "We understand luxury. We understand hospitality. And we are adept at fusing both to forge distinctive experiences for both voyagers and property owners alike.",
        "Only the finest residences make it to our roster. We meticulously select every home, rigorously verifying if it aligns with our lofty standards. The properties that earn the status of Just Home Stay homes are gorgeous, opulent, and flawless, owned by esteemed business magnates, celebrities, and high-net-worth individuals.",
        "Become a part of our network to metamorphose your villa into an easy-to-manage, high-profit, unique getaway for the discerning traveler.",
      ],
      src: "/room.webp",
    },
    {
      id: 2,
      title: "We Take Care of Everything",
      desc: [
        `Are you grappling with the perpetual concern of your home's well-being while residing in another city? Allow Just Home Stay to be your esteemed property management and maintenance partner, ensuring your cherished property remains impeccably maintained, just as you desire.`,
      ],
      src: "/roomservice.webp",
      items: [
        {
          id: 1,
          title: "Effortess Maintenance",
          desc: "The time and energy you spend on maintaining and servicing your home will reduce. Considerably. We’ll oversee everything with an eagle eye.",
        },
        {
          id: 2,
          title: "No Cost & 4X Revenue",
          desc: "The money you spend on upkeep drops to zero, and by hosting guests you’ll earn 4 times that amount in regular revenue.",
        },
        {
          id: 3,
          title: "Hassle-Free Hosting",
          desc: "Letting guests into your home is now effortless, with the Vista team managing everything from customer management to property management.",
        },
        {
          id: 4,
          title: "Exclusive Access",
          desc: "Our network of JHS homes across the country is yours to explore. Travel luxe in our unique homes with special owner discounts.",
        },
        {
          id: 5,
          title: "Flexibility In Travel",
          desc: "You get full flexibility when it comes to enjoying and visiting your own home. Block dates for your own stays, and getaway whenever you choose with no restrictions.",
        },
        {
          id: 6,
          title: "Your Home Is Your Haven",
          desc: "The beautiful home you’ve created stays pristine and perfect for you to enjoy, without any of the work that comes with it.",
        },
      ],
    },
    {
      id: 3,
      title: "Verified Guests only!",
      desc: [
        "While houses are built with bricks, homes are created with love. We ensure that every guest staying in your home during their holiday is thoroughly vetted and adheres to a strict check-in policy, keeping a careful record of each reservation.",
      ],
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] md:w-full">
        <Header />
        <div className="relative h-max">
          <Image
            src={mainimage}
            width={1920}
            height={800}
            className="h-max object-cover w-full lg:rounded-xl aspect-[4/2.35] lg:aspect-auto "
            alt="Partner With Us | JHS"
          />
          <div className="absolute  hidden top-0 right-0 lg:flex items-center justify-center lg:w-[30%] m-4">
            <form
              className="bg-white/50 p-4 rounded-lg"
              onSubmit={handleSubmit}
            >
              <input
                className="mb-4 w-full px-3 py-2 placeholder-gray-500  rounded-xl focus:outline-none focus:shadow-outline bg-white text-neutral"
                name="Name"
                placeholder="Name"
                onChange={handleChange}
                value={form.Name}
              />
              {errors.Name && <p className="text-red-500">{errors.Name}</p>}
              <input
                className="mb-4 w-full px-3 py-2 placeholder-gray-500  rounded-xl focus:outline-none focus:shadow-outline bg-white text-neutral"
                name="Email ID"
                placeholder="Email"
                onChange={handleChange}
                value={form["Email ID"]}
              />
              {errors["Email ID"] && (
                <p className="text-red-500">{errors["Email ID"]}</p>
              )}
              <input
                className="mb-4 w-full px-3 py-2 placeholder-gray-500  rounded-xl focus:outline-none focus:shadow-outline bg-white text-neutral"
                name="Mobile"
                placeholder="Mobile"
                onChange={handleChange}
                value={form.Mobile}
              />
              {errors.Mobile && <p className="text-red-500">{errors.Mobile}</p>}
              <input
                className="mb-4 w-full px-3 py-2 placeholder-gray-500  rounded-xl focus:outline-none focus:shadow-outline bg-white text-neutral"
                name="City"
                placeholder="City"
                onChange={handleChange}
                value={form.City}
              />
              {errors.City && <p className="text-red-500">{errors.City}</p>}
              <select
                className="mb-4 w-full px-3 py-2 placeholder-gray-500  rounded-xl focus:outline-none focus:shadow-outline bg-white text-neutral"
                name="Type"
                onChange={handleChange}
                value={form.Type}
              >
                <option value="">Select Property Type</option>
                <option value="Villa">Villa</option>
                <option value="Cottage">Cottage</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Under Construction">Under Construction</option>
              </select>
              {errors.Type && <p className="text-red-500">{errors.Type}</p>}
              <textarea
                className="mb-4 w-full px-3 py-2 placeholder-gray-500  rounded-xl focus:outline-none focus:shadow-outline bg-white text-neutral"
                name="Description"
                placeholder="Description"
                onChange={handleChange}
                value={form.Description}
              />
              {errors.Description && (
                <p className="text-red-500">{errors.Description}</p>
              )}
              <button
                className="w-full py-3 bg-primary text-white rounded-xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="bg-neutral lg:block hidden text-white w-full p-4 md:p-6 text-center mt-4 rounded-xl">
          <p>
            <span className="text-2xl">Your Holiday Villa can be...</span>
            <br />
            <span className="italic">
              A destination. A source of revenue. A pristine sanctuary.
            </span>
            <br />
            <span>Come on board and provide a Just Home Stay</span>
          </p>
        </div>
        <div className="mt-4 lg:flex hidden lg:flex-row flex-col lg:gap-8 gap-4">
          <Image
            src={image2}
            width={800}
            height={600}
            className="lg:w-2/5 w-full rounded-xl"
            alt="Partner With Us | JHS"
          />
          <p className="m-auto">
            <span>
              - We understand luxury. We understand hospitality. And we are
              adept at fusing both to forge distinctive experiences for both
              voyagers and property owners alike.
            </span>
            <br />
            <br />
            <span>
              - Only the finest residences make it to our roster. We
              meticulously select every home, rigorously verifying if it aligns
              with our lofty standards. The properties that earn the status of
              Just Home Stay homes are gorgeous, opulent, and flawless, owned by
              esteemed business magnates, celebrities, and high-net-worth
              individuals.
            </span>
            <br />
            <br />
            <span>
              - Become a part of our network to metamorphose your villa into an
              easy-to-manage, high-profit, unique getaway for the discerning
              traveler.
            </span>
          </p>
        </div>
        <div className="bg-primary lg:block hidden text-white rounded-xl my-4 p-4">
          <h2 className="w-full text-center text-2xl">Why Just Home Stay?</h2>
          <div className="flex justify-between mt-4 flex-wrap flex-col lg:flex-row">
            <div className="bg-white text-neutral text-center p-4 basis-1/3 rounded-lg scale-90 hover:scale-100 transition duration-300">
              <h3 className="text-lg font-bold">Effortess Maintenance</h3>
              <p className="mt-4">
                The time and energy you spend on maintaining and servicing your
                home will reduce. Considerably. We’ll oversee everything with an
                eagle eye.
              </p>
            </div>
            <div className="bg-white text-neutral text-center p-4 basis-1/3 rounded-lg scale-90 hover:scale-100 transition duration-300">
              <h3 className="text-lg font-bold">No Cost & 4X Revenue</h3>
              <p className="mt-4">
                The money you spend on upkeep drops to zero, and by hosting
                guests you’ll earn 4 times that amount in regular revenue.
              </p>
            </div>
            <div className="bg-white text-neutral text-center p-4 basis-1/3 rounded-lg scale-90 hover:scale-100 transition duration-300">
              <h3 className="text-lg font-bold">Hassle-Free Hosting</h3>
              <p className="mt-4">
                Letting guests into your home is now effortless, with the Vista
                team managing everything from customer management to property
                management.
              </p>
            </div>
            <div className="bg-white text-neutral text-center p-4 basis-1/3 rounded-lg scale-90 hover:scale-100 transition duration-300">
              <h3 className="text-lg font-bold">Exclusive Access</h3>
              <p className="mt-4">
                Our network of JHS homes across the country is yours to explore.
                Travel luxe in our unique homes with special owner discounts.
              </p>
            </div>
            <div className="bg-white text-neutral text-center p-4 basis-1/3 rounded-lg scale-90 hover:scale-100 transition duration-300">
              <h3 className="text-lg font-bold">Flexibility In Travel</h3>
              <p className="mt-4">
                You get full flexibility when it comes to enjoying and visiting
                your own home. Block dates for your own stays, and getaway
                whenever you choose with no restrictions.
              </p>
            </div>
            <div className="bg-white text-neutral text-center p-4 basis-1/3 rounded-lg scale-90 hover:scale-100 transition duration-300">
              <h3 className="text-lg font-bold">Your Home Is Your Haven</h3>
              <p className="mt-4">
                The beautiful home you’ve created stays pristine and perfect for
                you to enjoy, without any of the work that comes with it.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:block hidden">
          <Footer />
        </div>
        {/* mobile view */}
        <div className="lg:hidden px-4 flex flex-col gap-8 mt-8 mb-2">
          <ListYourPropertyForm />
          {data.slice(0, 2).map((item) => (
            <div className="flex flex-col gap-6" key={item.id}>
              <div className="w-full aspect-[4/2.8] relative rounded-lg overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title || "Justhome stay"}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-medium text-normal">{item.title}</h2>
              {item.desc.map((desc, i) => (
                <p key={i} className="text-lg text-normal">
                  {desc}
                </p>
              ))}
              {item.items?.map((item) => (
                <div className="flex gap-2" key={item.id}>
                  <span className="mt-1">
                    <CheckPointIcon />
                  </span>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl text-normal">{item.title}</h3>
                    <p className="text-base text-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="bg-dark w-full flex flex-col items-center py-8 px-4 rounded-lg text-white gap-4">
            <span className="">
              <VerifiedIcon />
            </span>
            <h2 className="text-2xl text-center">{data[2].title}</h2>
            <p className="text-lg text-center mt-2">{data[2].desc}</p>
          </div>
          <div className="relative aspect-[4/2.9] w-full">
            <Image
              src="/room1.webp"
              alt={data[2]?.title || "Justhome stay"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <Link
            href="/"
            className="flex items-center justify-center lg:hidden capitalize font-medium gap-2 border border-black rounded-md py-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const validate = (form) => {
  const errors = {};
  if (!form.Name.trim()) {
    errors.Name = "Name is required";
  }
  if (!form["Email ID"].trim()) {
    errors["Email ID"] = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(form["Email ID"])) {
    errors["Email ID"] = "Email is not valid";
  }
  if (!form.Mobile.trim()) {
    errors.Mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(form.Mobile)) {
    errors.Mobile = "Mobile number is not valid";
  }
  if (!form.City.trim()) {
    errors.City = "City is required";
  }
  if (!form.Type.trim()) {
    errors.Type = "Type of property is required";
  }
  if (!form.Description.trim()) {
    errors.Description = "Description is required";
  }
  return errors;
};

export default PartnerWithUs;
