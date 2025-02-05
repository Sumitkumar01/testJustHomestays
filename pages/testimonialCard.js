export default function TCard({review,image,name,profession,rating}) {
  
  return (
    <div className="m-2 p-2 bg-base-100 text-neutral rounded-xl drop-shadow-lg">
      <q>{review}</q>
      <div className="grid grid-cols-4 gap-x-2 mt-8">
        <div className="grid col-span-1">
          <img alt="Testimonial | JHS"
            src={image}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="grid col-span-3">
          <div className="rating">
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-secondary"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-secondary"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-secondary"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-secondary"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-secondary"
              checked
            />
          </div>
          <p className="font-bold">{name}</p>
          <p className="text-sm">{profession}</p>
        </div>
      </div>
    </div>
  );
}