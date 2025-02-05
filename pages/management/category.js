import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import { useRouter } from "next/router";

export default function Category() {
  const [category, setCategory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Categories",
      headers: { "xc-token": process.env.API_KEY },
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      setCategory(response.data.list);
    }
  };

  if (category.length > 0) {
    return (
      <div className="max-w-[1140px] justify-center mx-auto">
        <div className="flex justify-between my-4">
          <p className="text-xl font-bold">All Categories</p>
          <button className="btn btn-sm" onClick={() => router.back()}>
            Go Back
          </button>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Number of Properties</th>
              <th className="px-4 py-2">Edit Category</th>
            </tr>
          </thead>
          <tbody>
            {category.map((cat, index) => {
              return (
                <tr key={index} className="space-x-4">
                  <td className="text-center border px-4 py-2">{cat.Title}</td>
                  <td className="text-center border px-4 py-2">
                    <Image
                      src={"https://test.justhomestay.in/" + cat.Images[0].path}
                      width={1000}
                      height={1000}
                      className="w-36 aspect-[3/4] object-cover rounded-lg"
                    />
                  </td>
                  <td className="text-center border px-4 py-2">
                    {Number(cat["CountJHS"]) + Number(cat["CountSV"])}
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
  } else {
    return <div>Loading...</div>;
  }
}
