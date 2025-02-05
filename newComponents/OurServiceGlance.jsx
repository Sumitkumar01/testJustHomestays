import { SectionWithContainer } from "./SectionComponents";

const OurServiceGlance = () => {
  const data = [
    {
      numbers: "24x7",
      content: "5-Star Services",
    },
    {
      numbers: "4,800+",
      content: "5-Star Reviews",
    },
    {
      numbers: "500+",
      content: "Luxury Properties",
    },
    {
      numbers: "70,000+",
      content: "Happy Guests",
    },
  ];
  return (
    <SectionWithContainer sectionClassName="bg-[#1F1F1F]">
      <div className="bg-[#1F1F1F] flex flex-col lg:gap-12 gap-8">
        <h2 className="lg:text-4xl text-xl text-center text-white">
          Our Service at a Glance
        </h2>
        <div className="grid lg:grid-cols-4 grid-cols-2 items-center justify-between gap-5">
          {data.map((item, index) => (
            <div
              className={`flex lg:border-none flex-col items-center justify-center gap-3 pb-4 ${
                index === 0 || index === 1 ? "border-b border-white" : ""
              }`}
              key={index}
            >
              <h3 className="lg:text-2xl text-white font-semibold">
                {item.numbers}
              </h3>
              <p className="text-light lg:text-xl text-center">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWithContainer>
  );
};

export default OurServiceGlance;
