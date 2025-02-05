import { BsXLg } from "react-icons/bs";

export default function IInfo(props) {
  if (props.open) {
    return (
      <div
        onClick={() => props.from(false)}
        className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="modal-box max-w-screen-md p-4 text-right">
          <div className="flex justify-end">
          <button
            className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
            onClick={() => props.from(false)}
          >
            <BsXLg className="h-6 w-6"/>
          </button> 
          </div>
          <p className="font-bold text-center text-lg">
            Important Information about Property
          </p>
          <div className="overflow-y-auto mt-2 text-justify p-4">
            <p>Extra cost per Adult: ₹ {props.adult}/night</p>
            <p>Extra cost per Child: ₹ {props.child}/night</p>
            <p>Minimum Booking Period: {props.minbook} night(s)</p>
            <p>Maximum Booking Period: {props.maxbook} night(s)</p>
          </div>
        </div>
      </div>
    );
  }
}
