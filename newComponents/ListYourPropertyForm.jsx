import { useState } from "react";
import { countries } from "../util/countryCode";
import { DropDownIcon } from "../util/icons";

const ListYourPropertyForm = () => {
  const [userPhone, setUserPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 10) {
      setUserPhone(value);
      setErrorMessage(value.length < 10 ? "Please enter a valid number" : "");
    }
  };
  return (
    <div
      className="flex flex-col gap-6 py-6 px-4 w-full border border-light rounded-lg"
      style={{ boxShadow: "0px 7px 29px 0px rgba(100, 100, 111, 0.20)" }}
    >
      <h2 className="text-xl capitalize text-normal font-semibold">
        Get in Touch
      </h2>
      <form className="w-full flex-col flex gap-4 bg-white placeholder:bg-white">
        <input
          type="text"
          className="p-4 rounded-lg outline-none focus:outline-none border border-light bg-white placeholder:bg-white text-light placeholder:text-light"
          placeholder="Your full name*"
        />
        <div className="flex items-center rounded-lg border border-light">
          <select
            id="countryCode"
            name="countryCode"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="bg-transparent rounded-lg text-light w-[6rem] py-4 px-3 uppercase focus:outline-none"
          >
            {countries.map((country, index) => (
              <option
                key={index}
                value={country.code}
                className="text-[#b4b4b4]  bg-gray-100 uppercase "
              >
                {` ${country.code} ${country.name}`}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="phone"
            name="contact"
            placeholder="Mobile number*"
            value={userPhone}
            onChange={handlePhoneChange}
            className="w-full bg-transparent no-spinner p-4 text-base  placeholder:text-light text-light focus:outline-none"
            style={{ borderLeft: "1px solid #B4B4B4" }}
          />
        </div>
        <input
          type="email"
          className="p-4 rounded-lg outline-none focus:outline-none border border-light bg-white placeholder:bg-white placeholder:text-light text-light"
          placeholder="Email ID*"
        />
        <input
          type="text"
          className="p-4 rounded-lg outline-none focus:outline-none border border-light bg-white placeholder:bg-white placeholder:text-light text-light"
          placeholder="Your property location*"
        />
        <div className="bg-white relative flex items-center rounded-lg border border-light justify-between overflow-hidden">
          <select
            name="job title"
            id="job"
            required
            // value={userMessage}
            // onChange={(e) => setUserMessage(e.target.value)}
            className="w-full appearance-none px-3 py-3 outline-none text-light  bg-white placeholder:bg-white placeholder:text-light focus:outline-none"
          >
            <option value="0">Select type of property*</option>
            <option value="Villa">Villa</option>
            <option value="Cottage">Cottage</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Under Construction">Under Construction</option>
          </select>

          <div
            className="absolute right-3 top-5 pointer-events-none"
            id="select-svg"
          >
            <DropDownIcon />
          </div>
        </div>
        <input
          type="url"
          className="p-4 rounded-lg outline-none focus:outline-none border border-light bg-white placeholder:bg-white text-light placeholder:text-light"
          placeholder="Website Link/OTA link/Social Media Link*"
        />
        <button className="w-full bg-dark text-white active:scale-95 capitalize py-4 font-medium rounded-lg">
          submit
        </button>
      </form>
    </div>
  );
};

export default ListYourPropertyForm;
