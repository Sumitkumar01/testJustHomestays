import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Resizer from "react-image-file-resizer";

const justHsImages = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedimg, setSelectedimg] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const { deleteCookie, getCookie } = useCookies();
  const [upLoadImgData, setUpLoadImgData] = useState();

  useEffect(() => {
    setIsLoggedIn(getCookie("isAdminLoggedIn"));
  }, []);

  const imgFileHandler = (e) => {
    const files = Array.from(e.target.files);
    const resizedImages = [];

    files.forEach((file) => {
      Resizer.imageFileResizer(
        file,
        1440,
        1920,
        "WEBP",
        70,
        0,
        (uri) => {
          resizedImages.push(uri);
          if (resizedImages.length === files.length) {
            setImgFile(resizedImages);
            setSelectedImagePreviews(
              resizedImages.map((img) => URL.createObjectURL(img))
            );
          }
        },
        "blob"
      );
    });
  };

  const writetoDb = async () => {
    const uploadPromises = imgFile.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return axios.post(
        "https://test.justhomestay.in/api/v1/db/storage/upload?path=download",
        formData,
        {
          headers: {
            "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const uploadedFiles = responses.map((response) => response.data[0]);
      storeImgLink(uploadedFiles);
      alert("All images uploaded successfully");
    } catch (error) {
      console.error("Upload failed: ", error);
    }

    setSelectedImagePreviews([]);
    setUploadProgress(0);
    document.getElementById("uploadFile").value = "";
  };

  const remove = async () => {
    let filteredLinks = [];
    for (let i = 0; i < selectedimg.length; i++) {
      const element1 = selectedimg[i];
      for (let i = 0; i < data.length; i++) {
        const element2 = "https://test.justhomestay.in/" + data[i].path;
        filteredLinks.push(element1);

        if (element1 === element2) {
          data.splice(i, 1);
        }
      }
    }

    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "PATCH",
      url:
        "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property/" +
        id,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      data: {
        Images: data,
      },
    };
    const response = await axios.request(options);

    if (response.status === 200) {
      alert("Image Deleted Successfully");
    }
    setSelectedimg([]);
  };

  useEffect(() => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "GET",
      url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property",
      params: { limit: "1000", where: "(PID,eq," + id + ")", sort: "Town" },
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
      },
    };
    axios.request(options).then(function (res) {
      setData(res.data.list[0].Images);
    });
  }, [data]);

  const storeImgLink = async (uploadedFiles) => {
    let finalArrayOfImage = data ? uploadedFiles.concat(data) : uploadedFiles;

    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "PATCH",
      url: `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property/${id}`,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      data: { Images: finalArrayOfImage },
    };

    try {
      const response = await axios.request(options);
      if (response.status === 200) {
        alert("Image Inserted To NocoDB Successfully!");
      }
    } catch (error) {
      console.error("Error updating images in NocoDB: ", error);
    }
  };

  const selected = (img) => {
    if (
      selectedimg.includes(
        img.target.parentElement.parentElement.children[1].src
      )
    ) {
      const index = selectedimg.indexOf(
        img.target.parentElement.parentElement.children[1].src
      );
      let x = selectedimg.splice(index, 1);
    } else if (selectedimg.includes(img.target.parentElement.children[1].src)) {
      const index = selectedimg.indexOf(
        img.target.parentElement.children[1].src
      );
      let x = selectedimg.splice(index, 1);
    } else {
      setSelectedimg([...selectedimg, img.target.src]);
    }
  };

  const selectAll = () => {
    setSelectedimg(
      data.map((img) => {
        return "https://test.justhomestay.in/" + img.path;
      })
    );
  };

  const removeAll = () => {
    setSelectedimg([]);
  };

  const logOutHandler = () => {
    deleteCookie("isAdminLoggedIn");
    router.push("/management/login");
  };

  if (isLoggedIn) {
    return (
      <>
        <div className="my-5 mx-2">
          <a
            className="bg-blue-500 py-4 px-8 text-white rounded-lg mr-10"
            href="../management/justHomeStay"
          >
            Go Back
          </a>
          <a className="bg-red-500 py-4 px-8 text-white rounded-lg">
            <button onClick={logOutHandler}>Logout</button>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-[50vh] grid col-span-1 items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center gap-5">
              <div className="flex flex-row gap-5">
                <div>
                  <p className="font-semibold text-2xl ">Choose Image:</p>
                </div>
                <div>
                  <input
                    className="bg-white border border-black w-full h-8 rounded-lg px-2 py-1"
                    onChange={(e) => imgFileHandler(e)}
                    id="uploadFile"
                    type="file"
                    multiple
                  />
                </div>
              </div>
              <div className="image-preview">
                {selectedImagePreviews.map((imageSrc, index) => (
                  <img key={index} src={imageSrc} alt={`Selected ${index}`} />
                ))}
                {uploadProgress > 0 && (
                  <progress
                    className="progress w-56"
                    value={uploadProgress}
                    max="100"
                  ></progress>
                )}
              </div>
              <div>
                <button
                  onClick={() => writetoDb()}
                  className="bg-blue-950 px-6 py-2 rounded-lg text-white hover:scale-95"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {data && data.length === 0 ? (
            <div className="col-span-1 grid grid-cols-6 gap-2 mb-auto mr-2 ">
              <div className="grid col-span-6 justify-center">
                <h1 className="text-2xl font-semibold">No Image Found</h1>
              </div>
            </div>
          ) : (
            <div className="col-span-1 grid grid-cols-6 gap-2 mb-auto mr-2 ">
              <div className="grid col-span-6 grid-cols-2 justify-center my-5">
                <div className="flex justify-center">
                  <button
                    className="bg-green-600 px-4 py-2 rounded-lg text-white"
                    onClick={(e) => selectAll(e)}
                  >
                    Select All
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-blue-600 px-4 py-2 rounded-lg text-white"
                    onClick={() => removeAll()}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {data &&
                data.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="grid col-span-1 relative items-center"
                    >
                      <div
                        onClick={(e) => selected(e)}
                        src={img.path}
                        className={`${
                          selectedimg.includes(
                            "https://test.justhomestay.in/" + img.path
                          )
                            ? "absolute bg-black/30 z-20 w-full h-full rounded-lg"
                            : "z-0"
                        } `}
                      >
                        <img
                          src="../selectmark.png"
                          alt="selectmark"
                          className={`${
                            selectedimg.includes(
                              "https://test.justhomestay.in/" + img.path
                            )
                              ? "absolute left-[43%] top-[45%] z-30 h-6 w-6 "
                              : "hidden"
                          }`}
                        />
                      </div>
                      <img
                        className={`rounded-lg`}
                        onClick={(e) => selected(e)}
                        src={"https://test.justhomestay.in/" + img.path}
                      />
                    </div>
                  );
                })}
              {selectedimg && selectedimg.length >= 1 ? (
                <div className=" col-span-6  gap-2 mb-auto mr-2 ">
                  <button
                    className="col-span-6 w-full py-4 bg-primary text-white"
                    onClick={remove}
                  >
                    Delete Selected
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="w-full h-[100vh] ">
          <div className="flex flex-col  justify-center items-center mx-auto w-[30%] mt-[10%]">
            <h1 className="font-semibold text-2xl py-10">
              To get access login first
            </h1>
            <a href="/management/login">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Login First
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }
};

export default justHsImages;
