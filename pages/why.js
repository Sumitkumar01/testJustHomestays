import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";


export default function WJHS() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    lazyLoad: "ondemand",
  };

  const whys =  [
    {
      img: "https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/hide-private-hidden-icon.png",
      desc: "Private haven just for you and your loved ones",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/100/100443.png",
      desc: "Book for the entire family, for quality time",
    },
    {
      img: "https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/hide-private-hidden-icon.png",
      desc: "Private haven just for you and your loved ones",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/100/100443.png",
      desc: "Book for the entire family, for quality time",
    },
  ];

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "hidden", color: "#0C5110" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "hidden", color: "#0C5110" }}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="mt-6 justify-center px-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="hidden col-span-1  md:grid">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="grid col-span-1 gap-y-4">
              <div className="w-full bg-base-100 text-neutral rounded-lg outline outline-secondary outline-2 p-2">
                <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
                  <div className="grid col-span-1 my-auto">
                    <img
                      src="https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/hide-private-hidden-icon.png"
                      className="md:w-full w-1/2 mx-auto aspect-square object-contain p-1"
                    />
                  </div>
                  <div className="grid md:col-span-3 col-span-1 text-center">
                    <p>Private haven just for you and your loved ones</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-base-100 text-neutral rounded-lg outline outline-secondary outline-2 p-2">
                <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
                  <div className="grid col-span-1 my-auto">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/100/100443.png"
                      className="md:w-full w-1/2 mx-auto aspect-square object-contain p-1"
                    />
                  </div>
                  <div className="grid md:col-span-3 col-span-1 text-center">
                    <p>Book for the entire family, for quality time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid col-span-1 gap-y-4">
              <div className="w-full bg-base-100 text-neutral rounded-lg outline outline-secondary outline-2 p-2">
                <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
                  <div className="grid col-span-1 my-auto">
                    <img
                      src="https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/hide-private-hidden-icon.png"
                      className="md:w-full w-1/2 mx-auto aspect-square object-contain p-1"
                    />
                  </div>
                  <div className="grid md:col-span-3 col-span-1 text-center">
                    <p>Private haven just for you and your loved ones</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-base-100 text-neutral rounded-lg outline outline-secondary outline-2 p-2">
                <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
                  <div className="grid col-span-1 my-auto">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/100/100443.png"
                      className="md:w-full w-1/2 mx-auto aspect-square object-contain p-1"
                    />
                  </div>
                  <div className="grid md:col-span-3 col-span-1 text-center">
                    <p>Book for the entire family, for quality time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="block md:hidden">
        <Slider {...settings}>
        {whys.map((wh, i) => {
          return (
                <div className="grid col-span-1 p-1" key={i}>
                <div className="w-full bg-base-100 text-neutral rounded-lg outline outline-secondary outline-2 p-2">
                <div className="grid  grid-cols-4 gap-2 py-2" >
                <div className="grid col-span-1 my-auto">
                  <img
                    src={wh.img}
                    className="md:w-full w-1/2 mx-auto aspect-square object-contain "
                  />
                </div>
                <div className="grid col-span-3  ">
                  <p>{wh.desc}</p>
                </div>
              </div>
          </div>
        </div>
              )
            })}
        </Slider>
          </div>          
            

        <div className="grid col-span-1 pt-4">
          <div className="w-full bg-base-100 shadow-lg text-neutral rounded-lg p-2 text-center">
            <img
              src="https://ik.imagekit.io/poghmpjirks/Just_Home_Stay/lOGO_New_Final_r9iKABgm9.png?ik-sdk-version=javascript-1.4.3&updatedAt=1665079875068"
              className="w-48 mx-auto"
            />
            <p className="uppercase">Home Away from Home</p>
            <p className="pt-2 px-4">
              Experience the authenticity wherever you go without sacrificing on
              hospitality with our luxury homestays and tailored experiences for
              you and your family
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-max mt-8">
        <div className="grid grid-cols-5 px-4 py-2 mt-2 gap-2 outline outline-primary rounded-lg outline-1 text-primary">
          <div className="grid col-span-4">
            <p className="text-base text-center">About Us</p>
          </div>
          <div className="grid col-span-1 items-center">
            <ArrowRightIcon className="w-5 grid col-span-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
