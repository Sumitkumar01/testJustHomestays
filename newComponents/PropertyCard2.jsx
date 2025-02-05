import Image from "next/image";

const PropertyCard2 = ({ image, title, alt, asp }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl overflow-hidden border border-[#D6D6D6] shadow-xl w-full h-full">
      <div className={`relative w-full aspect-[4/3.5] ${asp ? asp : ""}`}>
        <Image
          src={"https://test.justhomestay.in/" + image}
          alt={alt || "Justhome stay"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 p-1">
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-white playball text-2xl text-center">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard2;
