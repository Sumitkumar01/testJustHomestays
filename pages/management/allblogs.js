import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function GetAllBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  const getBlogs = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Blogs",
      headers: { "xc-token": process.env.API_KEY },
      params: { sort: "-PublishDate" },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      setBlogs(response.data.list);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (blogs.length > 0)
    return (
      <div className="max-w-[1140px] justify-center mx-auto">
        <div className="flex justify-between my-4">
          <p className="text-xl font-bold">All Blogs</p>
          <div className="flex gap-x-4">
            <button className="btn btn-sm" onClick={() => router.back()}>
              Go Back
            </button>
            <button
              className="btn btn-sm bg-primary hover:bg-warning hover:text-black"
              onClick={() => router.push("/management/createblog")}
            >
              New Blog
            </button>
          </div>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Published Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((cat, index) => {
              return (
                <tr key={index} className="space-x-4">
                  <td className="text-center border px-4 py-2 max-w-sm">
                    {cat.Title}
                  </td>
                  <td className="text-center border px-4 py-2">
                    <Image
                      src={
                        cat.Image[0].path
                          ? "https://test.justhomestay.in/" + cat.Image[0].path
                          : "https://test.justhomestay.in/" + cat.Image
                      }
                      width={1000}
                      height={1000}
                      className="w-56 aspect-video object-cover rounded-lg mx-auto"
                    />
                  </td>
                  <td className="text-center border px-4 py-2">
                    {cat.PublishDate}
                  </td>
                  <td className="text-center border px-4 py-2">
                    {JSON.parse(
                      cat["Category"].replace(/^\{/, "[").replace(/\}$/, "]")
                    ).map((ct, index) => {
                      return (
                        <div className="text-xs flex m-1 justify-center">
                          <span
                            className="bg-gray-400 text-black py-2 px-2 rounded-lg"
                            key={index}
                          >
                            {ct}
                          </span>
                          <br />
                        </div>
                      );
                    })}
                  </td>
                  <td className="text-center border px-4 py-2">
                    <Link href={`./categoryedit?id=${cat.Id}`}>
                      <button className="btn btn-sm btn-primary">Edit</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}
