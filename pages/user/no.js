import { useRouter } from "next/router";

export default function NA() {
  const router = useRouter();
  return (
    <div className="py-20">
      <div className="">
        <h1 className="font-bold my-2 text-2xl">
          looks empty, you’ve no upcoming bookings.
        </h1>
        <p className="text-sm my-2 ">
          When you book a trip, you will see your itinerary here.
        </p>
        <a href="/">
          <button className="btn px-4 py-2 my-4 bg-primary text-base-100">
            Plan a Trip
          </button>
        </a>
      </div>
    </div>
  );
}
