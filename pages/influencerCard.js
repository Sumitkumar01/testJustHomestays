export default function ICard({image,handle,iglink,property,proplink}) {
    return (
      <div className="m-2 bg-base-100 text-neutral rounded-xl drop-shadow-lg text-center">
        <img
          src={image}
          className="w-full aspect-square object-cover rounded-t-xl"
        />
        <div className="p-2">
          <a href={iglink} target="_blank">
            <p className="italic pb-4">{handle}</p>
          </a>
          <p className="pb-4">Stayed at {property}</p>
          <a href={proplink} className="text-center w-max p-2 rounded-md outline outline-2 outline-primary text-primary bg-white hover:bg-primary hover:text-white mb-4">Explore This</a>
        </div>
      </div>
    );
}