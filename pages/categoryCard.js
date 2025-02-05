import Image from "next/image";

export default function CCard({ image, category, number, alt }) {
  return (
    <div className="card px-1 w-full aspect-[3/4] image-full bg-base-100 cursor-pointer">
      <figure>
        <Image
          src={"https://test.justhomestay.in/"+image}
          alt={alt || "Just home stay"}
          width={200}
          height={300}
          quality={30}
          webp="true"
          className="object-cover w-full"
        />
      </figure>
      <div className="card-body mt-auto p-3 gap-0">
        <h2 className="text-base font-bold">{category}</h2>
        <p className="text-left text-sm">{number} Properties</p>
      </div>
    </div>
  );
}
