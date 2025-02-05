import axios from "axios";
var FormData = require("form-data");
var fs = require("fs");

export default async function compressapi(req, res) {
  var data1 = JSON.parse(req.body);
  // console.log(req.body);

  try {
    let compresedData;
    var data = new FormData();
    data.append("file", data1);
    data.append("Content-Type", "multipart/form-data");
    data1.compression_level = "medium";
    data1.output = "pdfrest_compressed_pdf";

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.pdfrest.com/compressed-pdf",
      headers: {
        "Api-Key": "f8f57e28-de90-4e38-82e2-194b2b5b75b5",
        ...data1.getHeaders(),
      },
      data: data1,
    };

    axios(config)
      .then(function (response) {
        compresedData = response;
        console.log("1", response);
      })
      .catch((err) => {
        console.log("2", err.message);
      });

    return res.status(200).json({ data: compresedData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
