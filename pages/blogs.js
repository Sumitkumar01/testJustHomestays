import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Header from "./header";
import Heading from "./headings";
import Footer from "./Footer.jsx";
import Blogcard from "./components/blogCard.js";
import Head from "next/head";
import Link from "next/link.js";
import { SmallBackBtn } from "../util/icons.jsx";

export default function Blogs({ blogs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [clear, setClear] = useState(false);

  const handleSearch = () => {
    const filtered = blogs.filter(
      (blog) =>
        blog.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.Excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setClear(!clear);
  };

  const onClear = () => {
    setSearchTerm("");
    setFilteredBlogs(blogs);
    setClear(false);
  };

  const structure = {
    "@context": "http://schema.org",
    "@type": "Blogs",
    name: "Explore India with JHS | All Blogs | Just Home Stay",
    url: `https://justhomestay.in/blogs`,
    logo: `https://justhomestay.in/logo_main.webp`,
    description: `Dwelve into the world of possibilities with Just Home Stay and read as many blogs as your adventurous heart desires.`,
    telephone: "+919810325245",
    email: "priyanshu@justhomestay.in",
  };

  return (
    <div className="flex justify-center">
      <Head>
        <title>{`Explore India with JHS | All Blogs | Just Home Stay`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={`Dwelve into the world of possibilities with Just Home Stay and read as many blogs as your adventurous heart desires.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Explore India | All Blogs | Just Home Stay`}
        />
        <meta
          property="og:description"
          content={`Dwelve into the world of possibilities with Just Home Stay and read as many blogs as your adventurous heart desires.`}
        />
        <meta property="og:url" content={`https://justhomestay.in/blogs`} />
        <link rel="canonical" href={`https://justhomestay.in/blogs`} />
        <script
          key="structure"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON?.stringify(structure) }}
        />
        <meta charSet="UTF-8" />
      </Head>
      <div className="lg:w-[1140px] w-full md:px-0 px-4">
        <Header />
        <div className="flex justify-center">
          <div className="flex flex-col justify-center items-center max-w-screen-xl px-2 md:px-4 text-right w-screen md:w-full bottom-0 md:bottom-auto">
            {/* <Heading heading={"All Blogs"} /> */}
            <p className="flex lg:hidden gap-2 text-light text-sm w-full items-center capitalize">
              <Link href="/">home</Link>
              <span className="mt-1">
                <SmallBackBtn />
              </span>
              <Link href="/blogs">Our Blogs</Link>
            </p>
            <div className="lg:mt-8 mt-6 w-full">
              <div className="lg:flex hidden gap-4 justify-center w-full">
                <div className="flex gap-x-4">
                  <input
                    type="text"
                    value={searchTerm}
                    className="input input-bordered"
                    placeholder="Search Blogs..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => handleSearch()}
                    className="btn btn-primary btn-md"
                  >
                    Search
                  </button>
                  {clear ? (
                    <button
                      onClick={() => onClear()}
                      className="btn btn-secondary btn-md"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
                <div className="lg:hidden flex flex-col gap-3 w-full">
                  <h1 className="text-normal text-start text-2xl font-semibold capitalize">
                    Our blogs
                  </h1>
                  <p className="text-light text-lg text-start">
                    Discover a world of insights, ideas, and inspiration through
                    our latest blogs.
                  </p>
                </div>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mt-4 w-full">
                {filteredBlogs.map((blog, index) => (
                  <div key={index} className="md:basis-[48%] lg:basis-[32%]">
                    <Blogcard
                      image={blog.Image}
                      title={blog.Title}
                      excerpt={blog.Excerpt}
                      alt={blog.ImageAlt || blog.Title || "Just Home Stay Blog"}
                      slug={blog.slug}
                      keywords={blog.Keywords}
                      date={blog.PublishDate}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Blogs",
      headers: { "xc-token": process.env.API_KEY },
      params: { sort: "-PublishDate" },
    };
    const res = await axios.request(options);
    const blogs = res.data.list;

    return {
      props: {
        blogs,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return {
      props: {
        blogs: [],
      },
      revalidate: 60 * 60,
    };
  }
}
