import axios from "axios";
import fs from "fs";
import path from "path";

const homepage = "https://justhomestay.in";

export default async function handler(req, res) {
  try {
    const sitemapPath = path.join(process.cwd(), "/public/sitemap.xml");

    // Check if the sitemap.xml file exists and delete it if it does
    if (fs.existsSync(sitemapPath)) {
      fs.unlinkSync(sitemapPath);
      console.log("Old sitemap.xml file deleted.");
    }

    const jhsOptions = {
      method: "GET",
      url: process.env.API_URL + "Property/views/listingStatus",
      params: {
        limit: 1000,
        fields: "Slug",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    const stayvistaOptions = {
      method: "GET",
      url: process.env.API_URL + "StayVista/views/listingStatus",
      params: {
        limit: 1000,
        fields: "Slug",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    const locationOptions = {
      method: "GET",
      url: process.env.API_URL + "Location",
      params: {
        limit: 1000,
        fields: "Town",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    const categoryOptions = {
      method: "GET",
      url: process.env.API_URL + "Categories/views/active",
      params: {
        limit: 1000,
        fields: "slug",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    const blogOptions = {
      method: "GET",
      url: process.env.API_URL + "Blogs",
      params: {
        limit: 1000,
        fields: "slug",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    const jhsResponse = await axios.request(jhsOptions);
    const stayvistaResponse = await axios.request(stayvistaOptions);
    const locationResponse = await axios.request(locationOptions);
    const categoryResponse = await axios.request(categoryOptions);
    const blogResponse = await axios.request(blogOptions);

    const jhsData = jhsResponse.data.list;
    const stayvistaData = stayvistaResponse.data.list;
    const locationData = locationResponse.data.list;
    const categoryData = categoryResponse.data.list;
    const blogData = blogResponse.data.list;

    const data = [...jhsData, ...stayvistaData];

    const sitemap = generateSiteMap(data, locationData, categoryData, blogData);

    // Write the new sitemap to the file system
    fs.writeFileSync(sitemapPath, sitemap, "utf8");

    // Send response
    res
      .status(200)
      .json({ message: "Sitemap generated and saved successfully!" });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
}

function generateSiteMap(data, data2, data3, data4) {
  const urls = data?.map((item) => {
    const slug = item?.Slug;
    return {
      url: `${homepage}/property/${slug}`,
    };
  });
  const url2 = data2?.map((item) => {
    const slug = item?.Town;
    return {
      url: `${homepage}/location/${slug}`,
    };
  });
  const url3 = data3?.map((item) => {
    const slug = item?.slug;
    return {
      url: `${homepage}/category/${slug}`,
    };
  });
  const url4 = data4?.map((item) => {
    const slug = item?.slug;
    return {
      url: `${homepage}/blogs/${slug}`,
    };
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${homepage}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${homepage}/partner-with-us</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${homepage}/contact-us</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${homepage}/privacy-policy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${homepage}/cancellation-policy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${homepage}/terms-and-conditions</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${homepage}/blogs</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      ${urls
        ?.map((item) => {
          return (
            item &&
            `<url>
              <loc>${item?.url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
            </url>
          `
          );
        })
        .join("")}
        ${url2
          ?.map((item) => {
            return (
              item &&
              `<url>
                  <loc>${item?.url}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                </url>
              `
            );
          })
          .join("")}
          ${url3
            ?.map((item) => {
              return (
                item &&
                `<url>
                    <loc>${item?.url}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                  </url>
                `
              );
            })
            .join("")}
            ${url4
              ?.map((item) => {
                return (
                  item &&
                  `<url>
                      <loc>${item?.url}</loc>
                      <lastmod>${new Date().toISOString()}</lastmod>
                    </url>
                  `
                );
              })
              .join("")}
    </urlset>
  `;
}
