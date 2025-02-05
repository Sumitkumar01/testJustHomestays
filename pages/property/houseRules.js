import { BsTelephone, BsXCircle, BsXLg   } from "react-icons/bs";

export default function HRules(props) {
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
          <p className="font-bold text-center text-lg">House Rules</p>
          <p className="text-center text-base">
            Follow these rules to be a considerate guest and avoid any issues
            during your stay.
          </p>
          <div className="overflow-y-auto mt-2 text-justify p-4">
            <p className="text-base font-bold mt-2">Who can Stay?</p>
            <p>Maximum {props.guests} guests</p>
            <p>Pets are {props.pets ? null : <span>not</span>} Allowed</p>
            {props.petcost && props.petcost !== "0" ? (
              <p>
                Pet Fee: <span>₹ {props.petcost}/night</span> additional
              </p>
            ) : null}
          </div>
          <div className="overflow-y-auto mt-2 text-justify p-4">
            <p className="text-base font-bold mt-2">Additional Rules</p>
            {props.rules ? (
              <p dangerouslySetInnerHTML={{ __html: props?.rules }} />
            ) : (
              <p>No Additional Rules</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
