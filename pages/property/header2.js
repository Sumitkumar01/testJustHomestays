import Image from "next/image";
import { IoArrowBackOutline, IoSearchOutline } from "react-icons/io5";
import MModal from "../mobileModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { BsPhone, BsTelephone } from "react-icons/bs";
import Topbar from "../location/topbar";
import { useRouter } from "next/router";
import logo from "../../public/logo_main.webp";

export default function Header() {
  const [mmodal, setMmodal] = useState(false);
  const [value, setValue] = useState([]);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [propData, setPropData] = useState([]);

  const changeShow = () => {
    setShow(!show);
  };

  const options = {
    method: "GET",
    url: process.env.API_URL + "Location",
    params: { limit: "100" },
    headers: {
      "xc-token": process.env.API_KEY,
    },
  };

  async function fetchData() {
    try {
      let response1 = await fetch(
        `${process.env.API_URL}Property?limit=1000&fields=Title,Slug`,
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      let data1 = await response1.json();
      let response2 = await fetch(
        `${process.env.API_URL}StayVista?limit=1000&fields=Title,Slug`,
        {
          headers: {
            "xc-token": process.env.API_KEY,
          },
        }
      );
      let data2 = await response2.json();
      let data = [...data1.list, ...data2.list];
      setPropData(data);
    } catch (error) {
      console.error("Fetching data failed", error);
      return null;
    }
  }

  const getData = async () => {
    const tick = await axios.request(options);
    setArray(tick.data.list);
  };

  useEffect(() => {
    getData();
    fetchData();
  }, []);

  const setArray = (tick) => {
    var data = tick.map((lc, index) => ({
      ...data,
      id: index + 1,
      town: lc.Town,
      state: lc.State,
    }));
    setValue(data);
  };

  return (
    <div className="md:bg-base-100 bg-transparent  py-4 sticky left-1/4 md:left-0 md:w-full z-30 px-1 lg:px-0">
      <div className="navbar md:flex hidden justify-center">
        <div className="md:navbar-start bg-transparent">
          <a href="/">
            <Image
              src={logo}
              priority
              className="w-52"
              width={500}
              height={200}
            />
          </a>
        </div>
        <div className="navbar-center">
          <div
            onClick={() => changeShow()}
            className="items-center flex justify-center rounded-lg outline outline-info px-6 py-3 gap-x-4"
          >
            <IoSearchOutline className="w-5 h-5" />
            <p>Looking for something else?</p>
          </div>
        </div>
        <div className="navbar-end text-end gap-x-4">
          <a href="tel:+919810325245" className="flex gap-2">
            <BsPhone className="w-6 h-6 my-auto" />
            <p className="hover:underline hover:underline-offset-4 transition duration-150">
              +91 98103 25245
            </p>
          </a>
        </div>
      </div>
      {show ? (
        <div className="hidden md:block mt-4">
          <Topbar isProperty={true} />
        </div>
      ) : null}
      <div className="md:hidden flex gap-x-4 items-center px-2">
        <div
          onClick={() => router.back()}
          className="flex bg-neutral rounded-lg w-12 h-10 items-center justify-center text-white"
        >
          <IoArrowBackOutline className="w-5 h-5" />
        </div>
        <div
          onClick={() => setMmodal(true)}
          className="flex items-center justify-center rounded-lg outline outline-1 outline-primary w-full px-3 py-2 gap-x-2"
        >
          <IoSearchOutline className="w-5 h-5" />
          <p>Something else?</p>
        </div>
        {/* <div className="bg-secondary text-neutral items-center flex justify-center rounded-full w-10 h-10">
          <a href="tel:+919810325245" className="flex my-auto gap-x-2">
            <BsTelephone className="w-5 h-5 " />
          </a>
        </div> */}
      </div>
      <MModal
        open={mmodal}
        from={setMmodal}
        value={value}
        propdata={propData}
      />
    </div>
  );
}
