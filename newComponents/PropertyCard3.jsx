import Image from "next/image";

const PropertyCard3 = ({ src, name, alt }) => {
  return (
    <div className="">
      <div className="relative w-full aspect-square lg:rounded-t-lg max-sm:rounded-md overflow-hidden">
        <Image
          src={src}
          alt={alt || "Justhome stay"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
        />
        <div className="lg:hidden absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/30">
          <h3 className="text-white text-lg font-medium">{name}</h3>
        </div>
      </div>
      <h3 className="text-normal hidden lg:block text-center text-lg font-medium py-2 border-b border-l border-r rounded-b-lg">{name}</h3>
    </div>
  );
};

export default PropertyCard3;
