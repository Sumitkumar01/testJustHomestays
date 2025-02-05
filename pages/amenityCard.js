import Image from "next/image";

export default function ACard({ icon, amenity }) {
  if (icon && amenity) {
    return (
      <div
        className="w-full bg-base-100 rounded-xl drop-shadow-lg p-2"
        style={{ textAlign: "-webkit-center" }}
      >
        <Image
          src={"http://test.justhomestay.in:8080/" + icon.path}
          className="p-2 w-24 aspect-square justify-center"
          width={100}
          height={100}
          quality={30}
          alt={amenity || "Justhome stay"}
        />
        <p className="text-center text-xs md:text-sm">{amenity}</p>
      </div>
    );
  }

  return null;
}
