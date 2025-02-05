import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import AImages from "./allimages";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { BackIcon2, HeartIconFill } from "../../util/icons";
import { useRouter } from "next/navigation";

export default function Gallery({
  slug,
  initialImages = [],
  initialType = "",
  setWish,
  isWishlist,
}) {
  const [images, setImages] = useState(initialImages);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(initialType);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Handle window resize to detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch images from the new API if not provided in props
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/getImages?slug=${slug}`);
        if (response.ok) {
          const { images: fetchedImages, type: fetchedType } =
            await response.json();
          setImages(fetchedImages);
          setType(fetchedType);
        } else {
          console.error(`Error fetching images: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    // Only fetch if initialImages is empty
    if (!initialImages.length) {
      fetchImages();
    }
  }, [slug, initialImages.length]);

  const featuredImage = useMemo(() => images[0], [images]);
  const galleryImages = useMemo(() => images.slice(1, 4), [images]);

  if (!images.length) {
    return <p className="text-center text-gray-500">Loading images...</p>;
  }

  return (
    <>
      <div
        className="lg:grid hidden md:grid-cols-2 col-span-1 gap-2 mt-4 cursor-pointer lg:px-0"
        onClick={() => setOpen(true)}
      >
        {/* Featured Image */}
        {featuredImage && (
          <div className="grid col-span-1">
            <Image
              src={featuredImage}
              alt="Featured"
              className="rounded-xl aspect-[4/3] object-cover w-full"
              width={800}
              height={600}
              priority
            />
          </div>
        )}

        {/* Gallery Images */}
        <div className="grid col-span-1">
          <div className="grid md:grid-cols-2 grid-cols-3 gap-2">
            {(isMobile ? galleryImages.slice(0, 2) : galleryImages).map(
              (img, index) => (
                <div key={index} className="grid col-span-1">
                  <Image
                    src={img}
                    alt={`Gallery Image ${index + 1}`}
                    className="rounded-xl aspect-[4/3] object-cover"
                    width={400}
                    height={300}
                  />
                </div>
              )
            )}

            {/* View All Overlay */}
            {galleryImages.length > 2 && (
              <div className="grid col-span-1 relative cursor-pointer">
                <Image
                  src={galleryImages[2]}
                  alt="View All"
                  className="rounded-xl aspect-[4/3] cursor-pointer relative object-cover"
                  width={400}
                  height={300}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <p className="text-base-100 text-lg">View All</p>
                  <ArrowsPointingOutIcon className="inline-block w-6 text-base-100 ml-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:hidden w-full relative flex flex-col gap-2">
        {images?.map((img, index) => (
          <div key={index} className="relative w-full aspect-square">
            <Image
              src={img}
              alt={`Gallery Image ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0 ? true : false}
            />
          </div>
        ))}
        <div className="lg:hidden absolute pointer-events-auto py-2 z-40 top-0 left-0 w-full flex justify-between items-center px-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-lg"
          >
            <BackIcon2 />
          </button>
          <div className="">
            <button onClick={setWish} className="p-2 bg-white rounded-lg">
              <span className={`${isWishlist ? "text-red-500" : "text-light"}`}>
                <HeartIconFill />
              </span>
            </button>
          </div>
        </div>
      </div>
      <AImages open={open} from={setOpen} Images={images} type={type} />
    </>
  );
}
