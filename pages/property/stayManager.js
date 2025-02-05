import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Stepper from "../numStepper";
import { useSwipeable } from "react-swipeable";

export default function SubmitManager(props) {
  const PID = props.PID;
  const type = props.type;
  const title = props.title;
  const [formData, setFormData] = useState({
    Name: "",
    "Mobile Number": 0,
    "Email ID": "",
    PID,
    type,
    title,
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/sendContact", formData);
      if (response.status === 200) {
        await axios.post("/api/sendCEmail", formData);
        setSubmitSuccess(true);
        const sendEvent = () => {
          window.gtag("event", "stay_manager_form", {
            event_category: "Contact",
            event_label: "User submitted the form",
            form: formData,
          });
        };
        sendEvent();
        setFormData({
          Name: "",
          "Mobile Number": 0,
          "Email ID": "",
          PID,
          type,
          title,
        });
        handleReset();
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
  };

  function isValidEmail(email) {
    // Use a regular expression to validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  const handlers = useSwipeable({
    onSwipedDown: () => {
      props.from(false);
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (props.open) {
    return (
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="md:modal-box bg-base-100 w-full md:w-[9/10] md:max-w-screen-lg p-4 text-right transform-none md:max-h-[75vh] overflow-x-hidden h-max bottom-0 md:relative fixed md:h-max">
          <div
            {...handlers}
            className="p-1 w-full justify-center mx-auto block md:hidden pb-2"
          >
            <div className="h-2 w-36 bg-neutral rounded-full mx-auto"></div>
          </div>
          <p className="font-bold text-center text-lg mt-2">Contact Form</p>
          <p className="text-center mt-2">
            Please submit the form so that our Booking Manager can confirm the
            availability and get back to you!
          </p>
          <div className="flex flex-col place-content-between h-[50vh] md:h-max pb-4">
            <div className="block md:grid md:grid-cols-3 gap-4 mt-4 overflow-y-hidden">
              <div className="md:grid block text-left md:col-span-1 my-4 md:my-0">
                <label className="text-sm" for="Name">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  placeholder="Enter Name"
                  value={formData["Name"]}
                  onChange={handleChange}
                  className={
                    formData["Name"]
                      ? "input-success input input-bordered w-full mt-2"
                      : "input input-bordered w-full mt-2"
                  }
                  required
                />
              </div>
              <div className="md:grid block text-left md:col-span-1 my-4 md:my-0">
                <label className="text-sm" for="Mobile Number">
                  Mobile Number
                </label>
                <input
                  type="number"
                  name="Mobile Number"
                  placeholder="Enter 10-digit Mobile Number"
                  value={
                    formData["Mobile Number"] === 0
                      ? ""
                      : formData["Mobile Number"]
                  }
                  onChange={handleChange}
                  className={
                    formData["Mobile Number"] > 1000000000 &&
                    formData["Mobile Number"] <= 9999999999
                      ? "input input-bordered input-success w-full mt-2"
                      : "input input-bordered w-full mt-2"
                  }
                  required
                />
              </div>
              <div className="md:grid block text-left md:col-span-1 my-4 md:my-0">
                <label className="text-sm" for="Email ID">
                  Email ID
                </label>
                <input
                  type="email"
                  name="Email ID"
                  placeholder="Enter Email ID"
                  value={formData["Email ID"]}
                  onChange={handleChange}
                  className={
                    "input input-bordered w-full mt-2 " +
                    (isValidEmail(formData["Email ID"])
                      ? "input-success"
                      : null)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:mt-8">
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className={`bg-primary w-full md:w-max mx-auto text-base-100 rounded-lg px-6 py-2 mt-4`}
              >
                Submit Query
              </button>
              <button
                className="link hidden md:block"
                onClick={() => props.from(false)}
              >
                No, I'll continue looking
              </button>
              {submitSuccess ? (
                <div className="text-center mt-2">
                  Thank you for submitting your query, our booking manager will
                  be in connect with you soon!
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
