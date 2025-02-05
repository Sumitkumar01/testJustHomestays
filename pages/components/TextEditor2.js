import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import axios from "axios";
import { useRouter } from "next/router";

function TextEditor2({ desc, logOut }) {
  const { quill, quillRef } = useQuill();
  const [value, setValue] = useState();
  const router = useRouter();

  React.useEffect(() => {
    if (quill) {
      if (!desc  ) {
        quill.clipboard.dangerouslyPasteHTML("Description not available");
      } else if (desc) {
        quill.clipboard.dangerouslyPasteHTML(desc);
      } 
    }
  }, [quill, desc]);

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        setValue(quillRef.current.firstChild.innerHTML);
      });
    }
  }, [quill, desc]);

  const writetoDb = async () => {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("pid");
    const options = {
      method: "PATCH",
      url:
        "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Property/" +
        id,
      headers: {
        "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      data: { ['Long Description']: value }
    };
    const response = await axios.request(options);
    if (response.status === 200) {
      alert("LD Updated");
    }
  };

  return (
    <>
      <div className="w-full my-4 flex  items-start justify-start gap-4">
        <p>
          <button
            className="bg-[#3F85F4] text-white py-2 px-4 rounded-md "
            onClick={() => router.push(`./stayVista`)}
          >
            Go Back
          </button>
        </p>
        <p>
          <button
            className="bg-[#0e8d3f] text-white py-2 px-4 rounded-md "
            onClick={() => writetoDb()}
          >
            Insert To LD
          </button>
        </p>
        <p>
        <button
              className="px-6 py-2 bg-red-500 text-white rounded-lg"
              onClick={logOut}
            >
              Logout
            </button>
        </p>
      </div>
      <div className="flex justify-center w-full">
        <div style={{ width: "100%", height: "100%" }}>
          <div ref={quillRef} />
        </div>
      </div>
    </>
  );
}

export default TextEditor2;
