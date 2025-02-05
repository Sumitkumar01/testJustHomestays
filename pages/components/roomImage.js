import Image from "next/image";
import { useState, useEffect } from "react";

export default function RI(props) {
  const [images, setImages] = useState([]);

  const selected = (image) => {
    props.selected(image);
    props.from(false);
  };

  useEffect(() => {
    // Check if props.images is a string and parse it into an array
    if (
      props.type === "SV" &&
      props.images &&
      typeof props.images === "string"
    ) {
      const parsedImages = JSON.parse(props.images);
      if (Array.isArray(parsedImages)) {
        setImages(parsedImages);
      }
    }
    if (props.type === "JHS") {
      setImages(props.images);
    }
  }, [props.images]);

  if (props.open && images) {
    return (
      <div className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="modal-box max-w-screen-md p-4 text-right">
          <button
            className="bg-gray-300 rounded-full h-12 w-12"
            onClick={() => props.from(false)}
          >
            <span>x</span>
          </button>
          <p className="font-bold text-center text-lg">Select Image</p>
          <div className="flex flex-col w-full mt-4">
            {images.map((image, index) => (
              <Image
                onClick={() =>
                  selected(props.type === "SV" ? image : image.path)
                }
                key={index}
                width={800}
                height={400}
                src={props.type === "SV" ? image : image.path}
                alt={`Image ${index} `}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else return null;
}
