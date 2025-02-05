export default function Test() {
  const options = {
    method: "GET",
    headers: {
      "xc-token": "2DWffi70hVtxjgLcikyMaBtKaNdc2OZq80HgGa_r",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Accept": "*/*",
      "Access-Control-Allow-Origin": "http://localhost:8080",
    },
  };

  fetch(
    "http://localhost:8080/api/v1/db/data/noco/p_wa98zvkmqux8mm/Location/views/Grid%20view",
    options
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}
