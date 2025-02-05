import Image from "next/image";
export default function LCard({ image, location, number, alt, state }) {
  return (
    <div className="card px-2 w-full aspect-[3/4] image-full bg-base-100 cursor-pointer">
      <figure>
        <Image
          src={image}
          alt={alt || "Just home stay"}
          width={200}
          height={300}
          quality={30}
          webp="true"
          className="aspect-[3/4]"
        />
      </figure>
      <div className="card-body mt-auto p-3 gap-0">
        <h2 className="text-left text-base font-bold">{location}</h2>
        <p className="text-left text-sm pt-0">{state}</p>
        <p className="text-left text-sm pt-2">{number} Properties</p>
      </div>
    </div>
  );
}
