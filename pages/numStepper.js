import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function Stepper(props) {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    setNumber(props.value);
  }, [props.value]);

  function decrement() {
    let value = number;
    value--;
    if (value < 0) {
      value = 0;
    }
    setNumber(value);
    props.reverse(value);
  }

  function increment() {
    let value = number;
    value++;
    setNumber(value);
    props.reverse(value);
  }

  return (
    <div className="custom-number-input h-10 w-full ml-auto md:mx-auto flex justify-center">
      <div className="flex flex-row gap-x-1 lg:h-10 h-6 w-full rounded-lg relative bg-transparent mt-1 ">
        <button
          className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full rounded-full cursor-pointer outline-none aspect-square"
          onClick={decrement}
          id="decrement"
        >
          <FaMinus className="m-auto text-lg font-thin" />
        </button>
        <input
          type="number"
          className="focus:outline-none aspect-square text-center bg-transparent font-semibold text-lg hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none"
          name="custom-input-number"
          id={props.name}
          value={number}
          readOnly
        />
        <button
          className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full rounded-full cursor-pointer outline-none aspect-square"
          onClick={increment}
        >
          <FaPlus className="m-auto text-lg font-thin" />
        </button>
      </div>
    </div>
  );
}
