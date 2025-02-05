import Header from "./header";
import Footer from "./Footer.jsx";
import Link from "next/link";

export default function CPolicy() {
  return (
    <div className="lg:w-[1140px] w-full mx-auto">
      <div className=" policy-page">
        <Header />
        <div className="flex flex-col gap-4 max-md:px-4">
          <h2>Cancellation Policy</h2>

          <p>
            If you decide to cancel your reservation 14 days before the date of
            arrival, we will refund 80%* of the booking value using the same
            method of payment that was used initially, or we will issue a future
            credit note for the whole amount.
          </p>

          <p>
            If you have to cancel your reservation between 7 and 14 days before
            your scheduled arrival, you will receive a refund of 50% of the
            total booking value, or 60% of the value will be applied to a future
            credit note.
          </p>

          <p>
            The reservation fee will not be refunded for any cancellations that
            are requested less than seven days before the scheduled check-in
            date.
          </p>

          <p>
            If any of the costs associated with the reservation have already
            been paid, the cancellation will be regarded as non-refundable.
          </p>

          <p>
            <em>
              *Note that a cancellation fee equal to 20% of the total value of
              the booking will be deducted from any and all refunds that are
              processed by Just Home Stay. This largely applies to covering
              platform charges, convenience fees, and processing fees, as they
              are all included in this.
            </em>
          </p>

          <h2>Peak Dates</h2>

          <p>
            Our standard cancellation policy exempts cancellations made for peak
            dates.
          </p>
          <ul>
            <li>Holi- 22 March to 26 March 2024</li>
            <li>Good Friday and Easter Day- 28 March to 2 April 2024</li>
            <li>Ramzan Eid- 5 April to 10 April 2024</li>
            <li>Maharashtra Day- 1st May to 6th May 2024</li>
            <li>Eid- 14th June to 17th June 2024</li>
            <li>
              Independence Day & Raksha Bandhan- 14th August to 20th August 2024
            </li>
            <li>Ganesh Chaturthi- 6th September to 9th September 2024</li>
            <li>Onam- 13th September to 18th September 2024</li>
            <li>Gandhi Jayanti- 1st October to 2nd October 2024</li>
            <li>Durga Ashtami-11th October to 12th October 2024</li>
            <li>Diwali- 25th October to 31st October 2024</li>
            <li>Diwali & Bhai Dooj- 1st November to 3rd November 2024</li>
            <li>Guru Nanak Jayanti- 15th November to 17th November 2024</li>
            <li>Christmas & New year- 20th December to 31st December 2024</li>
          </ul>
        </div>
      </div>
      <div className="lg:hidden max-md:px-4 my-4">
        <Link
          href="/"
          className="flex items-center justify-center capitalize font-medium gap-2 border border-black rounded-md py-4"
        >
          Back to Home
        </Link>
      </div>
      <div className="lg:block hidden">
        <Footer />
      </div>
    </div>
  );
}
