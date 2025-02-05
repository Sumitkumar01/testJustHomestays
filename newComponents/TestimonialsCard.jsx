import Image from "next/image";
import { ReviewStar } from "../util/icons";
import { useState } from "react";

const TestimonialsCard = ({ name, review = "", src, profession, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 border border-light rounded-lg">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <span className="text-tertiary" key={i}>
            <ReviewStar />
          </span>
        ))}
      </div>
      <p className="text-lg  text-light">
        {isExpanded ? review : `${review.substring(0, 270)}`}
        <span
          className="font-semibold text-normal whitespace-nowrap cursor-pointer"
          onClick={handleReadMore}
        >
          {isExpanded ? " Show Less" : "...Read More"}
        </span>
      </p>
      <div className="flex items-center gap-4 mt-2">
        <div>
          <Image
            src={src}
            alt={alt || "Justhome stay"}
            width={80}
            height={80}
            className="object-cover rounded-full aspect-square"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-lg tracking-wider capitalize text-normal">
            {name}
          </h3>
          <p className="text-light text-base">{profession}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCard;
