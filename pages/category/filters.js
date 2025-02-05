import { useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import RangeSlider from "react-range-slider-input/dist/components/RangeSlider";

export default function Filter(props) {
  const [prop, setProp] = useState([]);
  const [total, setTotal] = useState(0);
  const [lvalue, setlValue] = useState(0);
  const [uvalue, setuValue] = useState(0);
  const [ltotal, setLtotal] = useState(0);
  const [utotal, setUtotal] = useState(0);

  const setRangeValues = () => {
    if (total > 0) {
      const filteredProperties = prop.filter((pr) => {
        const guestCount = Number(pr["Total Guests"]);
        return guestCount >= total;
      });

      setlValue(
        Math.round(
          Math.min(
            ...filteredProperties.map((pr) => Number(pr["Cost per Night"]))
          ) / 1000
        ) * 1000
      );
      setuValue(
        Math.round(
          Math.max(
            ...filteredProperties.map((pr) => Number(pr["Cost per Night"]))
          ) / 1000
        ) * 1000
      );
    } else {
      setlValue(
        Math.round(
          Math.min(...prop.map((pr) => Number(pr["Cost per Night"]))) / 1000
        ) * 1000
      );
      setuValue(
        Math.round(
          Math.max(...prop.map((pr) => Number(pr["Cost per Night"]))) / 1000
        ) * 1000
      );
      setLtotal(Math.min(...prop.map((pr) => Number(pr["Total Guests"]))));
      setUtotal(Math.max(...prop.map((pr) => Number(pr["Total Guests"]))));
    }
  };

  useEffect(() => {
    props.nv(false);
    setProp(props.array);
    if (props.total) {
      setTotal(props.total);
    }
  }, []);

  useEffect(() => {
    setRangeValues();
  }, [prop, total]);

  const handleChange = (e) => {
    setlValue(e[0]);
    setuValue(e[1]);
  };

  const handleChange2 = (e) => {
    setLtotal(e[0]);
    setUtotal(e[1]);
  };

  const handleSave = () => {
    props.lv(lvalue);
    props.uv(uvalue);
    if (ltotal > 0 && utotal > 0) {
      props.ltotal(ltotal);
      props.utotal(utotal);
      props.nv(true);
    }
    props.from(false);
  };

  if (props.open) {
    return (
      <div
        data-aos="zoom-out"
        data-aos-duration="500"
        className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="modal-box max-w-screen-md p-4 text-right">
        <div className="flex justify-end">
          <button
            className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
            onClick={() => props.from(false)}
          >
            <BsXLg className="h-6 w-6"/>
          </button> 
          </div>
          <p className="font-bold text-center text-lg">All Filters</p>
          <div className="mt-4">
            <div className="text-left font-bold">
              <p>Price Range (per Night)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 mb-2">
            <div className="col-span-1 text-left">{lvalue}</div>
            <div className="col-span-1">{uvalue}</div>
          </div>
          {total > 0 ? (
            <RangeSlider
              name="pricefilter"
              id="pricefilter"
              min={
                Math.round(
                  Math.min(...prop.map((pr) => Number(pr["Cost per Night"]))) /
                    1000
                ) * 1000
              }
              max={
                Math.round(
                  Math.max(...prop.map((pr) => Number(pr["Cost per Night"]))) /
                    1000
                ) * 1000
              }
              step={1000}
              defaultValue={[lvalue, uvalue]}
              onInput={(e) => {
                handleChange(e);
              }}
            />
          ) : (
            <RangeSlider
              name="pricefilter"
              id="pricefilter"
              min={
                Math.round(
                  Math.min(...prop.map((pr) => Number(pr["Cost per Night"]))) /
                    1000
                ) * 1000
              }
              max={
                Math.round(
                  Math.max(...prop.map((pr) => Number(pr["Cost per Night"]))) /
                    1000
                ) * 1000
              }
              step={1000}
              defaultValue={[lvalue, uvalue]}
              onInput={(e) => {
                handleChange(e);
              }}
            />
          )}
          {total == 0 ? (
            <div className="mt-4">
              <div className="text-left font-bold">
                <p>No. of Guests (Total)</p>
              </div>
              <div className="grid grid-cols-2 mb-2">
                <div className="col-span-1 text-left">{ltotal}</div>
                <div className="col-span-1">{utotal}</div>
              </div>
              <RangeSlider
                name="countfilter"
                id="countfilter"
                min={Math.min(...prop.map((pr) => pr["Total Guests"]))}
                max={Math.max(...prop.map((pr) => pr["Total Guests"]))}
                step={1}
                defaultValue={[ltotal, utotal]}
                onInput={(e) => {
                  handleChange2(e);
                }}
              />
            </div>
          ) : null}
          <div className="mt-8 w-full text-center">
            <button onClick={() => handleSave()} className="btn btn-primary">
              Show Results
            </button>
          </div>
        </div>
      </div>
    );
  }
}
