import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import _ from "lodash";

export default function CategoryEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [petallowed, setPetallowed] = useState("");
  const [numGuests, setNumGuests] = useState("");
  const [categoryOption, setCategoryOption] = useState("");
  const [properties, setProperties] = useState(null);
  const [selectedAmenityData, setSelectedAmenityData] = useState([]);

  const fetchPage = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Amenities",
      params: { limit: "100", sort: "-TotalCount" },
      headers: { "xc-token": process.env.API_KEY },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      setAmenities(response.data.list);
    }
    return null;
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const options = {
        method: "GET",
        url: `${process.env.API_URL}Categories/${id}`,
        headers: { "xc-token": process.env.API_KEY },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setCategory(response.data);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  useEffect(() => {
    fetchPage();
  }, []);

  const handleAmenityChange = (selectedList, selectedItem) => {
    setSelectedAmenities(selectedList);
  };

  const handlePetAllowedChange = (event) => {
    setPetallowed(event.target.value);
  };

  const handleNumGuestsChange = (event) => {
    setNumGuests(event.target.value);
  };

  const handleCategoryOptionChange = (event) => {
    setCategoryOption(event.target.value);
  };

  const fetchProperties = async () => {
    const options1 = {
      method: "GET",
      url: `${process.env.API_URL}StayVista`,
      params: { filter: "(Pets%20Allowed%2Ceq%2Ctrue)" },
      headers: { "xc-token": process.env.API_KEY },
    };

    const options2 = {
      method: "GET",
      url: `${process.env.API_URL}Property`,
      params: { filter: "(Pets%20Allowed%2Ceq%2Ctrue)" },
      headers: { "xc-token": process.env.API_KEY },
    };

    try {
      const [response1, response2] = await Promise.all([
        axios.request(options1),
        axios.request(options2),
      ]);

      if (response1.status === 200 && response2.status === 200) {
        // Combine the results from the two tables
        const combinedProperties = [
          ...response1.data.list,
          ...response2.data.list,
        ];
        setProperties(combinedProperties);
      }
    } catch (error) {
      console.log("Error fetching properties: ", error);
    }
  };

  const fetchAmenitiesData = async () => {
    const selectedAmenitiesData = await Promise.all(
      selectedAmenities.map(async (amenity) => {
        const options = {
          method: "GET",
          url: `${process.env.API_URL}Amenities/${amenity.ncRecordId}`,
          headers: { "xc-token": process.env.API_KEY },
        };
        const response = await axios.request(options);
        const data = response.data;
        data.combinedList = [
          ...data["Property List"],
          ...data["StayVista List"],
        ]; // combine the two lists
        return data.combinedList;
      })
    );

    const flattenedData = selectedAmenitiesData.flat(); // Flatten the array of arrays
    const uniqueData = _.uniqBy(flattenedData, function (item) {
      // Use different keys for different types of objects
      return item.type === "JHS" ? item.ncRecordId : item.Id;
    });

    setSelectedAmenityData(uniqueData);
  };

  const selectProperties = () => {
    switch (categoryOption) {
      case "pets":
        if (petallowed === "yes") {
          fetchProperties();
        } else {
          console.log("Please select 'yes' to fetch properties allowing pets.");
        }
        break;
      case "amenities":
        fetchAmenitiesData();
        console.log("Select properties with amenities: ", selectedAmenities);
        break;
      case "largeGroups":
        if (numGuests) {
          fetchPropertiesForLargeGroups();
        } else {
          console.log(
            "Please enter a minimum number of guests to fetch properties for large groups."
          );
        }
        break;
      default:
        console.log("Select a filter option");
    }
  };

  const fetchPropertiesForLargeGroups = async () => {
    const options1 = {
      method: "GET",
      url: `${process.env.API_URL}StayVista`,
      params: { filter: `("Total%20Guests",gt,${numGuests})` },
      headers: { "xc-token": process.env.API_KEY },
    };
  
    const options2 = {
      method: "GET",
      url: `${process.env.API_URL}Property`,
      params: { filter: `("Total%20Guests",gt,${numGuests})` },
      headers: { "xc-token": process.env.API_KEY },
    };
  
    try {
      const [response1, response2] = await Promise.all([
        axios.request(options1),
        axios.request(options2),
      ]);
  
      if (response1.status === 200 && response2.status === 200) {
        // Combine the results from the two tables
        const combinedProperties = [
          ...response1.data.list,
          ...response2.data.list,
        ];
        setProperties(combinedProperties);
      }
    } catch (error) {
      console.log("Error fetching properties: ", error);
    }
  };  
  
  const setCategoryApi2 = async () => {
    const promises = selectedAmenityData.map((property) => {
      let endpoint = "";
      if (property.Type === "JHS") {
        endpoint = `Categories/${id}/mm/JHS/${property.ncRecordId}`;
      } else {
        endpoint = `Categories/${id}/mm/SV/${property.Id}`;
      }

      const options = {
        method: "POST",
        url: `${process.env.API_URL}${endpoint}`,
        headers: { "xc-token": process.env.API_KEY },
      };

      return axios.request(options);
    });

    try {
      await Promise.all(promises);
      console.log("All properties have been published successfully!");
    } catch (error) {
      console.error("Error publishing properties: ", error);
    }
  };

  const setCategoryApi = async () => {
    const promises = properties.map((property) => {
      let endpoint = "";
      if (property.Type === "JHS") {
        endpoint = `Categories/${id}/mm/JHS/${property.ncRecordId}`;
      } else {
        endpoint = `Categories/${id}/mm/SV/${property.PID}`;
      }

      const options = {
        method: "POST",
        url: `${process.env.API_URL}${endpoint}`,
        headers: { "xc-token": process.env.API_KEY },
      };

      return axios.request(options);
    });

    try {
      await Promise.all(promises);
      console.log("All properties have been published successfully!");
    } catch (error) {
      console.error("Error publishing properties: ", error);
    }
  };

  return (
    <div className="max-w-[1140px] h-auto mx-auto p-8">
      <div className="flex justify-between mt-4">
        <p className="text-2xl font-bold text-gray-800">Edit Category</p>
        <button
          className="btn btn-sm py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <div>
        {category ? (
          <table className="w-full mt-6 border-collapse table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-gray-500 uppercase tracking-wider">
                  No. of Properties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="border px-4 py-2">{category.Id}</td>
                <td className="border px-4 py-2">{category.Title}</td>
                <td className="border px-4 py-2">{category.Description}</td>
                <td className="border px-4 py-2">
                  {Number(category.CountJHS) + Number(category.CountSV)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="mt-6 text-lg text-gray-500">Loading...</div>
        )}
      </div>
      <div className="mt-8 w-full">
        <p className="text-lg font-bold text-center">Filters</p>
        <div className="my-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="categoryOption"
          >
            Select Category
          </label>
          <select
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="categoryOption"
            value={categoryOption}
            onChange={handleCategoryOptionChange}
          >
            <option value="">Select Option</option>
            <option value="pets">Pets Allowed</option>
            <option value="amenities">Amenities</option>
            <option value="largeGroups">For Large Groups</option>
          </select>
        </div>
        <div className="flex flex-auto gap-x-8">
          {categoryOption === "pets" && (
            <div className="my-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="petallowed"
              >
                Pets Allowed?
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="petallowed"
                value={petallowed}
                onChange={handlePetAllowedChange}
              >
                <option value="">Select Yes/No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}
          {categoryOption === "amenities" && (
            <div className="my-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="amenities"
              >
                Filter by Amenities
              </label>
              <Multiselect
                options={amenities}
                displayValue="Name"
                onSelect={handleAmenityChange}
                selectedValues={selectedAmenities}
                onRemove={handleAmenityChange}
              />
            </div>
          )}
          {categoryOption === "largeGroups" && (
            <div className="my-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="numGuests"
              >
                For Large Groups
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="numGuests"
                value={numGuests}
                placeholder="Enter Min. No. of Guests"
                onChange={handleNumGuestsChange}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 w-full">
        <button
          className="btn btn-sm py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={selectProperties}
        >
          Select Properties
        </button>
      </div>
      {properties && properties.length > 0 ? (
        <div className="mt-4">
          <p>
            {properties.length} <span>Properties found!</span>
          </p>
          <div className="mt-4 w-full">
            <button
              onClick={setCategoryApi}
              className="btn btn-sm py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            >
              Publish Category
            </button>
          </div>
        </div>
      ) : null}
      {selectedAmenityData && selectedAmenityData.length > 0 ? (
        <div className="mt-4">
          <p>
            {selectedAmenityData.length} <span>Properties found!</span>
          </p>
          <div className="mt-4 w-full">
            <button
              onClick={setCategoryApi2}
              className="btn btn-sm py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            >
              Publish Category
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
