import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Multiselect from "multiselect-react-dropdown";

function TextEditor2({ desc, logOut }) {
  const { quill, quillRef } = useQuill();
  const [value, setValue] = useState();
  const [title, setTitle] = useState("");
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [alt, setAlt] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const [alllocations, setallLocations] = useState([]);
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState();

  const reset = () => {
    setValue(desc);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setImagePreview("");
    setAlt("");
    setKeywords([]);
    setCategory([]);
    setLocation([]);
    setallLocations([]);
    setDate(new Date());
    setImage();
  };

  const updateCategory = (string) => {
    var temp = new Array();
    temp = string.split(",");
    setCategory(temp);
  };

  const getLocations = async () => {
    const options = {
      method: "GET",
      url: process.env.API_URL + "Location",
      headers: {
        "xc-token": process.env.API_KEY,
      },
      params: {
        limit: 1000,
      },
    };

    const response = await axios.request(options);
    setallLocations(response.data.list);
  };

  const handleSelect = (selectedList, selectedItem) => {
    setLocation(selectedList);
  };

  const handleRemove = (selectedList, removedItem) => {
    setLocation(selectedList);
  };

  useEffect(() => {
    getLocations();
  }, []);

  const updateKeywords = (string) => {
    var temp = new Array();
    temp = string.split(",");
    setKeywords(temp);
  };

  React.useEffect(() => {
    if (quill) {
      if (!desc) {
        quill.clipboard.dangerouslyPasteHTML("Description not available");
      } else if (desc) {
        quill.clipboard.dangerouslyPasteHTML(desc);
      }
    }
  }, [quill, desc]);

  const updateSlug = (string) => {
    const value1 = string.replace(/\s/g, "_");
    const value2 = value1.toLowerCase();
    setSlug(value2);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  useEffect(() => {
    if (title.length > 0) {
      updateSlug(title);
    }
  }, [title]);

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        setValue(
          quillRef.current.firstChild?.innerHTML
            ? quillRef.current.firstChild.innerHTML
            : desc
        );
      });
    }
  }, [quill, desc]);

  const updateLocale = async (id, loc) => {
    const options = {
      method: "POST",
      url: `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Blogs/${id}/mm/Location/${loc.ncRecordId}`,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    axios.request(options);
  };

  const writetoDb = async () => {
    const formData = new FormData();
    formData.append("file", image);
    const imageuri = await axios.post(
      "https://test.justhomestay.in/api/v1/db/storage/upload?path=download",
      formData,
      {
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (imageuri.status === 200) {
      const options = {
        method: "POST",
        url: process.env.API_URL + "Blogs",
        headers: {
          "xc-token": process.env.API_KEY,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        data: {
          Title: title,
          Excerpt: excerpt,
          Content: value,
          ImageAlt: alt,
          Image: imageuri.data[0].path,
          slug: slug,
          Keywords: keywords,
          Category: category,
          PublishDate: new Date(date),
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        const id = response.data.Id;
        for (const loc of location) {
          updateLocale(id, loc);
        }
        reset();
        alert("Blog Created");
      }
    }
  };

  return (
    <>
      <div className="w-full my-4 flex  items-start justify-start gap-4">
        <p>
          <button
            className="bg-[#3F85F4] text-white py-2 px-4 rounded-md "
            onClick={() => router.push(`/management/allblogs`)}
          >
            Go Back
          </button>
        </p>
        <p>
          <button
            className="bg-[#0e8d3f] text-white py-2 px-4 rounded-md "
            onClick={() => writetoDb()}
          >
            Create Blog
          </button>
        </p>
        <p>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg"
            onClick={logOut}
          >
            Logout
          </button>
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4 w-full">
        <div className="flex w-full gap-x-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input flex-grow input-bordered max-w-1/2"
            placeholder="Enter Title"
          />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="input flex-grow input-bordered max-w-1/2"
            placeholder="Enter Blog Slug"
          />
        </div>
        <div className="w-full">
          <textarea
            className="input input-bordered w-full"
            placeholder="Enter Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <div ref={quillRef} />
        </div>
        <div className="flex w-full gap-x-4">
          <input
            type="file"
            className="input input-bordered flex-grow"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview Image"
              className="w-60 aspect-video"
            />
          )}
        </div>
        <div className="w-full">
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Enter ImageALT"
            className="input input-bordered w-full"
          />
        </div>
        <div className="w-full flex gap-4">
          <textarea
            className="flex-grow input input-bordered"
            onChange={(e) => updateKeywords(e.target.value)}
            placeholder="Enter Keywords (seperated by comma)"
          />
          <textarea
            className="flex-grow input input-bordered"
            onChange={(e) => updateCategory(e.target.value)}
            placeholder="Enter Category (seperated by comma)"
          />
        </div>
        <div className="w-full flex gap-4">
          <Multiselect
            selectedValues={location}
            options={alllocations}
            onSelect={handleSelect}
            onRemove={handleRemove}
            displayValue="Town"
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="input input-bordered"
          />
        </div>
      </div>
    </>
  );
}

export default TextEditor2;
