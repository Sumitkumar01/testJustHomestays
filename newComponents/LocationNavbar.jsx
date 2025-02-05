import Link from "next/link";
import { BackIcon, CallIcon, PencelIcon } from "../util/icons";
import { useRouter } from "next/router";

const LocationNavbar = ({ locationName, setShowSearchByProperty }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const handleEdit = () => {
    setShowSearchByProperty(true);
  };
  return (
    <>
      <header className="max-w-[1600px] mx-auto w-full">
        <nav className="flex gap-2 items-center justify-center w-full  mx-auto px-4 py-2">
          <button
            className="bg-white rounded-lg flex justify-center items-center"
            onClick={handleBack}
          >
            <BackIcon />
          </button>
          <div className="rounded-lg flex items-center justify-between gap-8 px-2 py-2 bg-white border border-light">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-normal">
                {locationName}
              </p>
              <p className="text-sm text-light">15 Jan - 16 jan, 02 Guest</p>
            </div>
            <button
              onClick={handleEdit}
              className="flex flex-col items-center gap-2 ml-auto"
            >
              <span className="">
                <PencelIcon />
              </span>
              <span className="text-normal text-sm">Edit</span>
            </button>
          </div>
          <Link href="tel:+919810325245" className="md:hidden text-[#393939]">
            <span className="sr-only">call button</span>
            <CallIcon />
          </Link>
        </nav>
      </header>
    </>
  );
};

export default LocationNavbar;
