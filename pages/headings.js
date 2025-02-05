export default function Heading({ heading }) {
  return (
    <div className="w-max justify-center max-w-screen-sm mx-auto mt-12">
      <img
        className="mx-auto md:w-16 w-12 hidden md:block"
        src="https://ik.imagekit.io/poghmpjirks/Just_Home_Stay/JSH_Hut__1__dGHPurM5N.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1665323477941"
      />
      <div className="grid grid-cols-4 gap-2">
        <div className="md:grid col-span-1 my-auto hidden">
          <img
            alt="Left Kit | JHS"
            src="https://ik.imagekit.io/poghmpjirks/Just_Home_Stay/JSH_Line_pTsoyJv73.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1665323621648"
          />
        </div>
        <div className="grid md:col-span-2 col-span-4">
          <h2 className="md:text-2xl font-bold text-xl text-center">
            {heading}
          </h2>
        </div>
        <div className="md:grid hidden col-span-1 my-auto">
          <img
            alt="Right Kit | JHS"
            src="https://ik.imagekit.io/poghmpjirks/Just_Home_Stay/JSH_Line_pTsoyJv73.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1665323621648"
          />
        </div>
      </div>
    </div>
  );
}
