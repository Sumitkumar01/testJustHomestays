import axios from "axios";

const nocodbApi = axios.create({
  baseURL: process.env.API_URL, // Update the URL to match your NocoDB instance
  headers: {
    "xc-token": process.env.API_KEY, // Add your NocoDB API key to your .env file
  },
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchData = async () => {
  const perPage = 15;
  const totalPages = Math.ceil(1234 / perPage);
  const allData = [];

  for (let page = 1; page <= totalPages; page++) {
    const response = await axios.get(
      `https://api.vistarooms.com/api/v2/property-list`,
      {
        params: { page: page },
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          apiKey: "45CF5-15516",
          secretKey: "0b202f12835710c65165de4021ae65cbdfa577b3",
        },
      }
    );

    allData.push(...response.data.response.data);

    await delay(1500);
  }

  return allData;
};

const turnOffAllProperties = async () => {
  try {
    // First, determine the total number of properties
    const initialResponse = await nocodbApi.get(
      `/StayVista/views/ListedProperties`,
      { params: { limit: 1 } }
    );
    const totalRows = initialResponse.data.pageInfo.totalRows;
    // const totalRows = 25;
    const limit = 25; // or another number that suits your API's rate limits
    const totalPages = Math.ceil(totalRows / limit);

    // Fetch and update properties in batches
    for (let page = 1; page <= totalPages; page++) {
      const { data: properties } = await nocodbApi.get(
        `/StayVista/views/ListedProperties`,
        {
          params: { limit: limit, offset: (page - 1) * limit },
        }
      );
      // console.log(properties.list);

      for (const property of properties.list) {
        // console.log(property.Id);
        await nocodbApi.patch(`/StayVista/${property.Id}`, {
          "Listing Status": false,
        });
      }
    }
  } catch (error) {
    console.error("Error turning off properties:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const updateOrAddProperty = async (property) => {
  // console.log(property.id);
  try {
    const { data: existingItem } = await nocodbApi.get(`/StayVista`, {
      params: { where: "(Id,eq," + property.id + ")" },
    });

    const schema = {
      Id: property.id,
      VistaName: property.vista_name,
      Description: property.description,
      PropertyType: property.property_type,
      City: property.city,
      Locality: property.locality,
      Latitude: Number(property.latitude),
      Longitude: Number(property.longitude),
      State: property.state,
      Rooms: property.rooms,
      MinOccupancy: property.min_occupancy,
      MaxOccupancy: property.max_occupancy,
      PrivateBathrooms: property.private_bathrooms,
      SharedBathrooms: property.shared_bathrooms,
      MinNumberOfNights: property.min_number_of_nights,
      SecurityDeposite: property.security_deposite,
      InstantBook: property.instant_book,
      Slug: property.slug,
      CityTags: property.city_tags,
      ShortDescription: property.short_description,
      LuxuryCollection: property.luxury_collection,
      Price: JSON.stringify(property.price),
      Amenities: JSON.stringify(property.amenities),
      HouseRules: JSON.stringify(property.house_rules),
      Photos: JSON.stringify(property.photos),
      Faq: JSON.stringify(property.faq),
      "Listing Status": true,
    };

    if (existingItem.pageInfo.totalRows == 1) {
      // Update existing property
      await nocodbApi.patch(`/StayVista/${property.id}`, schema);
    } else {
      // Add new property
      await nocodbApi.post(`/StayVista`, schema);
    }
  } catch (error) {
    console.error("Error updating or adding property:", error);
  }
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await turnOffAllProperties();

      const fetchedData = await fetchData();
      for (const item of fetchedData) {
        await updateOrAddProperty(item);
      }

      // await deleteNonExistingProperties(fetchedData);

      res.status(200).json({ message: "Data Sync Successful" });
    } catch (error) {
      console.error("Error syncing data:", error);
      res.status(500).json({ message: "Error syncing data", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
