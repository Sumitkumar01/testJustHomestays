import Header from "./header";
import Footer from "./Footer.jsx";

export default function PPolicy() {
  return (
    <div className="flex justify-center">
      <div className="lg:w-[1140px] w-full mx-auto">
        <Header />
        <div className="text-left text-lg mt-8 md:w-2/3 md:mx-auto mx-4">
          <h2 className="text-4xl font-bold text-center text-primary">
            TERMS & CONDITIONS
          </h2>

          <p className="mt-4 text-xl">
            <span className="font-bold">Introduction</span>
            <br />
            Welcome to JustHomestay.in. By using our website and services, you
            agree to comply with and be bound by the following terms and
            conditions. Please review them carefully before booking any of our
            properties.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">
            1. Acceptance of Terms
          </h2>
          <p className="mt-4 text-xl">
            By accessing or using our services, you agree to the following Terms
            and Conditions. If you do not agree with these terms, please refrain
            from using our services.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">
            2. Bookings and Payments
          </h2>
          <ul>
            <li>
              - All bookings made through JustHomestay.in are subject to
              availability.
            </li>
            <li>
              - Full or partial payment is required at the time of booking, as
              specified during the booking process.
            </li>
            <li>
              - Payment options include credit cards, debit cards, and other
              online payment gateways supported by our website.
            </li>
            <li>
              - Your booking is only confirmed once we receive the full payment.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8">
            3. Cancellations and Refunds
          </h2>
          <ul>
            <li>
              - Cancellations: If you wish to cancel your booking, you must do
              so within the time frame specified during your booking. The
              cancellation policy will vary based on the property.
            </li>
            <li>
              - Refunds: Refunds for cancellations will be processed according
              to the cancellation policy mentioned at the time of booking.
              Refunds may take 7-10 business days to reflect in your account.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8">
            4. Check-in and Check-out
          </h2>
          <ul>
            <li>- Check-in Time: 2:00 PM.</li>
            <li>- Check-out Time: 11:00 AM.</li>
            <li>
              - Early check-in or late check-out requests may be accommodated
              based on availability but could incur additional charges.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8">
            5. Guest Responsibilities
          </h2>
          <ul>
            <li>
              - Guests are responsible for maintaining the condition of the
              property during their stay.
            </li>
            <li>
              - Any damages to the property caused by guests or their invitees
              will be charged accordingly.
            </li>
            <li>
              - Guests must adhere to the house rules provided at each property.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8">
            6. Limitation of Liability
          </h2>
          <ul>
            <li>
              - JustHomestay.in will not be held liable for any direct,
              indirect, incidental, or consequential damages that arise out of
              your use of our services or stay at one of our properties.
            </li>
            <li>
              - We are not responsible for any personal injuries, loss, or theft
              of personal belongings during your stay.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8">
            7. Property Listings
          </h2>
          <ul>
            <li>
              - We make every effort to ensure that the property descriptions
              and photos on our website are accurate and up-to-date.
            </li>
            <li>
              - However, JustHomestay.in does not guarantee that the properties
              will be exactly as described. Variations may occur due to property
              maintenance or upgrades.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8">
            8. Privacy Policy
          </h2>
          <p className="mt-4 text-xl">
            Your privacy is important to us. Please refer to our{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>{" "}
            for details on how we handle your personal data.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">
            9. Force Majeure
          </h2>
          <p className="mt-4 text-xl">
            JustHomestay.in will not be liable for any failure to perform due to
            circumstances beyond our control, including but not limited to
            natural disasters, pandemics, strikes, or any other events of force
            majeure.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">
            10. Changes to Terms
          </h2>
          <p className="mt-4 text-xl">
            We reserve the right to update or modify these Terms and Conditions
            at any time without prior notice. The latest version of the Terms
            and Conditions will be available on our website.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">
            11. Governing Law
          </h2>
          <p className="mt-4 text-xl">
            These terms are governed by and construed in accordance with the
            laws of India, and you irrevocably submit to the exclusive
            jurisdiction of the courts in Dehradun.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8">
            12. Contact Us
          </h2>
          <p className="mt-4 text-xl">
            If you have any questions regarding these Terms and Conditions,
            please contact us at:
            <br />
            <a href="mailto:info@justhomestay.in" className="underline">
              Email: info@justhomestay.in
            </a>
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
