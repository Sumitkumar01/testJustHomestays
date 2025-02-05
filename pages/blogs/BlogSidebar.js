import react, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Sidebar() {
  const [blogData, setBlogData] = useState();
  const router = useRouter();

  useEffect(() => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Blogs",
      params: { sort: "-PublishDate", limit: "9" },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setBlogData(response.data.list);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  const blogClick = (link) => {
    router.push(`${window.location.origin}/blogs/${link}`);
  };

  if (blogData) {
    return (
      <div className="bg-accent flex flex-col md:flex-row lg:flex-col gap-4 rounded-2xl drop-shadow-xl p-4 mb-auto">
        {blogData.map((blog, index) => (
          <div key={index} className="cursor-pointer basis-1/3">
            <a onClick={() => blogClick(blog.slug)} className="cursor-pointer">
              <Image
                src={
                  blog.Image.length != 0
                    ? `https://test.justhomestay.in/${blog.Image}`
                    : ""
                }
                className="aspect-video rounded-lg"
                alt={blog.ImageAlt || "Just home stay"}
                width={400}
                height={300}
              />
              <h2 className="py-2 font-bold text-base">{blog.Title}</h2>
            </a>
          </div>
        ))}
      </div>
    );
  }
}
