import Header from "./header";
import Footer from "./Footer.jsx";
import Heading from "./headings";
import {
  MdOutlineMailOutline,
  MdOutlineLocalPhone,
  MdOutlineHome,
} from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import Form from "../newComponents/Form";

export default function Contact() {
  return (
    <div className="lg:w-[1140px] mx-auto">
      <Header />
      <div className="lg:w-[1140px] mx-auto w-full md:px-0 px-4 pb-4 max-md:mt-4">
        <div className="flex  flex-col lg:gap-8 gap-4 justify-center w-full pb-8">
          {/* <div className="max-md:hidden">
            <Heading heading={"Contact Us"} />
          </div> */}
          <h1 className="font-bold text-xl lg:text-center lg:uppercase lg:text-3xl">
            Contact Us
          </h1>
          <p className="lg:text-center lg:w-2/3 mx-auto">
            We look forward to making your stay with Just Homestay as
            comfortable as possible, if you have any queries, please feel free
            to connect us directly over email or contact us directly.
          </p>
          <div className="relative w-full lg:aspect-[4/1.6] aspect-[4/3]">
            <Image
              src="/contact-us.jpg"
              alt="Contact Us"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="lg:grid grid-cols-2 flex flex-col-reverse gap-5">
            <div className="flex flex-col gap-4">
              <h2 className="font-medium text-xl test-[#393939]">
                Contact Details
              </h2>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex lg:flex-col gap-4">
                  {/* <MdOutlineLocalPhone className="w-8 h-8 mx-auto lg:block hidden" /> */}

                  <Link href="tel:+919810325245">
                    <span>
                      <span className="">Call Us:</span> +91 98103 25245
                    </span>
                  </Link>
                </div>
                <div className="flex flex-col  gap-4">
                  {/* <MdOutlineMailOutline className="w-8 h-8 mx-auto lg:block hidden" /> */}
                  <Link href="mailto:info@justhomestay.in">
                    <span>
                      <span className="">Email:</span> info@justhomestay.in
                    </span>
                  </Link>
                </div>

                <div className="flex flex-col  gap-4">
                  {/* <MdOutlineHome className="w-8 h-8 mx-auto lg:block hidden" /> */}
                  <p className="">
                    Just Homestay 363A, Lane No. 5 Chankya Marg, Subash Nagar
                    Dehradun, Uttarakhand 248001
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-lg flex flex-col gap-4 border border-[#B4B4B4] py-4 px-4">
              <h2 className="font-medium text-xl">Get in Touch</h2>
              <Form />
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center justify-center lg:hidden capitalize font-medium gap-2 border border-black rounded-md py-4"
        >
          Back to Home
        </Link>
        <div className="lg:block hidden">
          <Footer />
        </div>
      </div>
    </div>
  );
}
