import { useEffect, useState } from "react";

export default function DCard(props) {
  const discount = props.discount;
  var myHeaders = new Headers();
  const [disc, setDisc] = useState([]);

  myHeaders.append("Authorization", "Bearer keyqr8i1QluuOLwTR");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const handleClick = (e) => {
    props.selected(e * 100);
    props.name(disc.Name);
  };

  const getDiscount = () => {
    fetch(
      "https://api.airtable.com/v0/appmb6iDjAZASSrda/tblEEfcaatdomOGiv?filterByFormula=UID%3D" +
        discount +
        "&view=Grid+view",
      requestOptions
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setDisc(myJson.records[0].fields);
      });
  };

  useEffect(() => {
    getDiscount();
  }, []);

  if (props.nights >= disc["Length of Stay"]) {
    return (
      <div
        onClick={() => handleClick(disc.Discount)}
        className="outline-dashed outline-2 rounded-lg my-4 outline-primary  cursor-pointer hover:outline-4"
      >
        <div className="px-2 py-4">
          <h3 className="font-bold text-lg ">
            {disc.Name} - <span>{disc.Discount * 100}% OFF</span>
          </h3>
          <p>Minimum booking - {disc["Length of Stay"]} night(s)</p>
          <p className="text-sm pt-2">{disc.Description}</p>
        </div>
      </div>
    );
  }
}
