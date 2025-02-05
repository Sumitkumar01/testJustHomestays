import Search from "./homeBar";
import Image from "next/image";

export default function Hero() {
  const title = (
    <h1 className="text-center text-base-100 font-medium text-2xl md:text-3xl pt-6 uppercase">
      handpicked
      <br />
      <span className="text-base-100 uppercase font-bold md:text-5xl text-4xl">
        Luxury Homes
      </span>
    </h1>
  );

  return (
    <div className="z-30">
      <figure className="relative bg-black rounded-3xl">
        <Image
          src="/main_mobile.webp"
          className="w-full opacity-80 object-cover rounded-3xl md:hidden"
          width={360}
          height={360}
          priority
          alt="Hero Image Mobile | JHS"
        />
        <div
          style={{
            backgroundImage: 'url("/main_desktop.webp")',
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
          className="w-full aspect-[4/3] md:aspect-[16/6] md:block hidden"
        ></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex flex-col justify-between h-full py-4">
            {title}
            <Search />
          </div>
        </div>
      </figure>
    </div>
  );
}
