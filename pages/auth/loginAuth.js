import React, { useState, useEffect } from "react";

const loginAuth = () => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  

  const submitHandler = (event) => {
    event.preventDefault();
    if (enteredEmail == "Rohan" && enteredPassword == "123456") {
        console.log("Login Successfully!");
    }else{
        console.log("Wrong email and pass did not match");
    }
  };

  return (
    <div className="w-[30%] h-[100vh] m-auto">
      <form onSubmit={submitHandler} className="flex flex-col my-20">
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label htmlFor="email">E-Mail</label>
          </div>

          <div className="col-span-3">
            <input
              className="bg-white  border border-black w-full"
              type="email"
              id="email"
              value={enteredEmail}
              onChange={emailChangeHandler}
            />
          </div>
        </div>
        <div className="py-5 grid grid-cols-4">
          <div className="col-span-1">
            <label htmlFor="password">Password</label>
          </div>
          <div className="col-span-3">
            <input
              className="bg-white  border border-black w-full"
              type="password"
              id="password"
              value={enteredPassword}
              onChange={passwordChangeHandler}
            />
          </div>
        </div>
        <div className="">
          <button
            type="submit"
            className="text-white bg-black py-2 px-5"
            onClick={submitHandler}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default loginAuth;
