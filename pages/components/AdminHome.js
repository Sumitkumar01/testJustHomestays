import React from "react";
import AllPhotos from "./AllPhotos";
import { useCookies } from "react-cookie";

const AdminHome = ({ logOut }) => {
  const { deleteCookie } = useCookies();

  const logOutHandler = () => {
    deleteCookie("isAdminLoggedIn");
    logOut(false);
  };

  return (
    <>
      <div className="w-full pt-4 flex justify-end pr-8">
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
          onClick={logOutHandler}
        >
          Logout
        </button>
      </div>
      <div className="w-full h-[100vh] ">
        <div className="flex justify-around  mx-auto w-[50%] mt-[10%]">
          <a href="/management/stayVista">
            <button className="bg-green-500 py-4 px-14 rounded-lg mx-auto hover:scale-95 text-white">
              Stay Vista
            </button>
          </a>

          <a href="/management/justHomeStay">
            <button className="bg-orange-500 py-4 px-8 rounded-lg m-auto hover:scale-95 text-white">
              Just Home Stay
            </button>
          </a>

          <a href="/management/category">
            <button className="bg-red-500 py-4 px-8 rounded-lg m-auto hover:scale-95 text-white">
              Categories
            </button>
          </a>

          <a href="/management/allblogs">
            <button className="bg-yellow-500 py-4 px-8 rounded-lg m-auto hover:scale-95 text-black">
              Blogs
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
