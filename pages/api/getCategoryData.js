import { capitalCase } from "change-case";

export default async function handler(req, res) {
  const { slug } = req.query;

  // console.log("Slug is here :" + slug)

  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    // Fetch the category details to get categoryId
    const categoryResponse = await fetch(
      `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Categories/find-one?fields=Id,Description,Title,slug,Images&where=(slug,eq,${slug})`,
      {
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      }
    );

    if (!categoryResponse.ok) {
      throw new Error(`Error fetching category: ${categoryResponse.status}`);
    }

    const categoryData = await categoryResponse.json();
    // console.log("kjlk", categoryData)

    if (!categoryData || !categoryData.Id) {
      return res.status(404).json({ error: "Category not found" });
    }

    const categoryId = categoryData.Id;

    // Fetch the SV Multiplier from the Admin table
    const adminResponse = await fetch(
      `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Admin`,
      {
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      }
    );

    if (!adminResponse.ok) {
      throw new Error(`Error fetching SV Multiplier: ${adminResponse.status}`);
    }

    const adminData = await adminResponse.json();
    const svMultiplier =
      adminData.pageInfo.totalRows === 1
        ? Number(adminData.list[0]["SV Multiplier"])
        : 1; // Default to 1 if not found

    // Fetch data from both APIs using categoryId
    const fetchFromTable = async (table) => {
      const response = await fetch(
        `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Categories/${categoryId}/mm/${table}?limit=1000&offset=0`,
        {
          headers: {
            "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching data from ${table}: ${response.status}`
        );
      }

      return response.json();
    };

    const svData = (await fetchFromTable("SV"))?.list || [];
    const propertyData = (await fetchFromTable("JHS"))?.list || [];

    // Filter the data to include only required fields
    const filteredSVData = svData.map((item) => ({
      Type: "SV", // Hardcoded as SV since this data comes from the SV table
      PID: item.PID || null,
      ncRecordId: item.ncRecordId || null,
      Id: item.Id || null,
      Town: capitalCase(item.Town) || null,
      State: capitalCase(item.State) || null,
      instantBooking: item["Instant Booking"] || null,
      Guests: item["Total Guests"] || null,
      Cost: item["Cost per Night"]
        ? item["Cost per Night"] * svMultiplier
        : null, // Adjust cost using SV Multiplier
    }));

    const filteredPropertyData = propertyData.map((item) => ({
      Type: "JHS", // Hardcoded as JHS since this data comes from the JHS table
      PID: item.PID || null,
      ncRecordId: item.ncRecordId || null,
      Id: item.Id || null,
      Town: capitalCase(item.Town) || null,
      State: capitalCase(item.State) || null,
      instantBooking: item["Instant Booking"] || null,
      Guests: item["Total Guests"] || null,
      Cost: item["Cost per Night"] || null,
    }));

    const combinedProperties = [...filteredSVData, ...filteredPropertyData];

    // Return the category data and filtered combined properties
    return res.status(200).json({
      categoryData,
      combinedProperties,
    });
  } catch (error) {
    console.error("Fetching category data failed:", error);
    return res.status(500).json({ error: "Failed to fetch category data" });
  }
}
