import React from "react";

const LoginForm = (props) => {
  return (
    <div>
      <div className="w-[30%] h-[100vh] m-auto">
        <form
          onSubmit={props.submitBtn}
          className="flex flex-col my-20 border border-black px-3 py-12 rounded-lg"
        >
          <div className="pb-10 mx-auto">
            <h1 className="font-bold text-3xl bg-[#c5f542] rounded-lg py-2 pr-2">
              <span className="text-[#c5f542] bg-black rounded-lg p-1">
                Admin
              </span>{" "}
              Login
            </h1>
          </div>
          <div className="grid grid-cols-4 pt-5">
            <div className="col-span-1 flex items-center">
              <label htmlFor="email" className="text-xl">
                E-Mail
              </label>
            </div>

            <div className="col-span-3">
              <input
                className="bg-white  border border-black w-full h-8 rounded-lg px-2"
                type="email"
                value={props.email}
                onChange={props.emailHandler}
              />
            </div>
          </div>
          <div className="py-5 grid grid-cols-4">
            <div className="col-span-1">
              <label htmlFor="password" className="text-xl">
                Password
              </label>
            </div>
            <div className="col-span-3">
              <input
                className="bg-white  border border-black w-full h-8 rounded-lg px-2"
                type="password"
                value={props.password}
                onChange={props.passwordhandler}
              />
            </div>
          </div>
          <div className="mx-auto pt-5">
            <button
              type="submit"
              className=" bg-black py-2 px-5 rounded-lg  text-xl text-[#c5f542] disabled:opacity-40"
              onClick={props.submitBtn}
              disabled={!props.formIsValid}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
