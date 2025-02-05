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
  const totalPages = Math.ceil(981 / perPage);
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

const storeData = async (data) => {
  for (const item of data) {
    const { data: existingItem } = await nocodbApi.get(`/StayVista`, {
      params: {
        where: "(Id,eq," + item.id + ")",
      },
    });

    const schema = {
      Id: item.id,
      VistaName: item.vista_name,
      Description: item.description,
      PropertyType: item.property_type,
      City: item.city,
      Locality: item.locality,
      Latitude: Number(item.latitude),
      Longitude: Number(item.longitude),
      State: item.state,
      Rooms: item.rooms,
      MinOccupancy: item.min_occupancy,
      MaxOccupancy: item.max_occupancy,
      PrivateBathrooms: item.private_bathrooms,
      SharedBathrooms: item.shared_bathrooms,
      MinNumberOfNights: item.min_number_of_nights,
      SecurityDeposite: item.security_deposite,
      InstantBook: item.instant_book,
      Slug: item.slug,
      CityTags: item.city_tags,
      ShortDescription: item.short_description,
      LuxuryCollection: item.luxury_collection,
      Price: JSON.stringify(item.price),
      Amenities: JSON.stringify(item.amenities),
      HouseRules: JSON.stringify(item.house_rules),
      Photos: JSON.stringify(item.photos),
      Faq: JSON.stringify(item.faq)
    };
    // return existingItem.pageInfo.totalRows;

    if (existingItem.pageInfo.totalRows == 1) {
      await nocodbApi.patch(`/StayVista/${item.id}`, schema);
    } else {
      await nocodbApi.post(`/StayVista`, schema);
    }
  }
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fetchData();
      // console.log(data)
      await storeData(data);
      // const check = await storeData(data[0]);
      res.status(200).json({ message: "Data synced successfully" });
    } catch (error) {
      console.error("Error syncing data:", error);
      res.status(500).json({ message: "Error syncing data", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

