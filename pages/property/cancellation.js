import { useEffect, useState } from "react";

export default function Cancellation({ cid }) {
  const [policy, setPolicy] = useState([]);
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer keyqr8i1QluuOLwTR");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  const GetStaticProps = () => {
    fetch("https://api.airtable.com/v0/appmb6iDjAZASSrda/tblnXtNJdxA1MPAEm?filterByFormula=%7BPID%7D%3D'" + cid + "'&view=Grid+view", requestOptions)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setPolicy(myJson.records[0].fields);
      });
  }

  useEffect(() => {
    GetStaticProps();
  }, []);
  return (
    <div>
      <h3 className="font-bold">{policy.Name +" - "+ policy.Type}</h3>
      <p>{policy.Policy}</p>
    </div>
  )
}