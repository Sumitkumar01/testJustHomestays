import { BsXLg } from "react-icons/bs";
import ACard from "./amenitygrid";

export default function APAmenities(props) {
  if (props.open) {
    return (
      <div
        onClick={() => props.from(false)}
        className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="modal-box max-w-screen-xl p-4 text-right">
          <div className="flex justify-end">
          <button
            className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
            onClick={() => props.from(false)}
          >
            <BsXLg className="h-6 w-6"/>
          </button> 
          </div>
          <div className="text-center mx-auto justify-center">
            <p className="font-bold text-center text-lg">Amentities to Offer</p>
          </div>
          <div className="overflow-y-hidden mt-4">
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 overflow-y-auto p-2">
              {props.amen &&
                props.amen.map((am) => (
                  <ACard key={am.ncRecordId} id={am.ncRecordId} all={true} />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
