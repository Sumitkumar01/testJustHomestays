import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

export default function AImages(props) {
  const [arr, setArr] = useState([]);
  const { Images: photos } = props;
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  useEffect(() => {
    const images = photos.map((p) => ({
      src: p,
    }));
    setArr(images);
  }, [photos]);

  const openLightbox = useCallback((index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % arr.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + arr.length) % arr.length);
  };

  if (props.open) {
    return (
      <div className="bg-white justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="fixed top-0 w-full bg-white">
          <button
            className="text-lg py-4 px-4 font-bold"
            onClick={() => props.from(false)}
          >
            <span>{`< Back`}</span>
          </button>
        </div>
        <div className="w-full max-w-full shadow-none bg-transparent justify-center text-right max-h-[100vh] overflow-y-auto">
          <div className="overflow-x-none overflow-y-auto grid grid-cols-1 gap-4 p-4">
            {arr.map((img, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={img.src}
                  alt={`Image ${index + 1}`}
                  className="rounded-xl object-cover aspect-auto h-auto"
                  width={1920}
                  height={1080}
                />
              </div>
            ))}
          </div>
        </div>

        {viewerIsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={closeLightbox}
            >
              ✕
            </button>
            <div className="flex items-center">
              <button className="text-white text-3xl px-4" onClick={prevImage}>
                ‹
              </button>
              <Image
                src={arr[currentImage].src}
                alt={`Lightbox Image ${currentImage + 1}`}
                className="rounded-xl object-contain md:max-w-[100%] md:max-h-[80vh] max-w-[80%]"
                width={800}
                height={600}
              />
              <button className="text-white text-3xl px-4" onClick={nextImage}>
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
