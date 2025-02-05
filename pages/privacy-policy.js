import Header from "./header";
import Footer from "./Footer.jsx";
import Link from "next/link";

export default function PPolicy() {
  return (
    <div className="lg:w-[1140px] w-full mx-auto">
      <div className=" policy-page">
        <Header />
        <div className="flex flex-col gap-4 max-md:px-4">
          <h2>PRIVACY POLICY</h2>

          <p>
            At Just Home Stay, we respect your privacy and are committed to
            protecting your personal information. This Privacy Policy describes
            how we collect, use, disclose, store, and protect your information
            when you interact with us through our website, mobile applications,
            and other online services. Please read this policy carefully to
            understand our practices.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you use our services, we may collect the following types of
            information:
          </p>

          <h3>1.1 Personal Information</h3>
          <p>
            This includes your name, email address, phone number, billing and
            shipping address, payment information, and any other personal
            details you provide when registering an account, making a booking,
            or communicating with us.
          </p>

          <h3>1.2 Usage Information</h3>
          <p>
            We automatically collect data about your interactions with our
            services, such as your search queries, the pages you visit, the date
            and time of your visit, and other similar information.
          </p>

          <h3>1.3 Device Information</h3>
          <p>
            We may collect information about the device you use to access our
            services, including the hardware model, operating system, unique
            device identifiers, and mobile network information.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, improve, and
            personalize our services, including to:
          </p>
          <ul>
            <li>Process your bookings and send you booking confirmations.</li>
            <li>Respond to your inquiries and requests.</li>
            <li>
              Send you updates, promotional materials, and other information
              about our services.
            </li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our services.
            </li>
            <li>
              Detect, prevent, or address fraud, security, or technical issues.
            </li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>
            We may share your information with third parties under the following
            circumstances:
          </p>
          <ul>
            <li>With your consent.</li>
            <li>
              With our business partners, suppliers, and sub-contractors for the
              performance of any contract we enter into with them or you.
            </li>
            <li>As required by law or to comply with legal processes.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal
            information from accidental loss and from unauthorized access, use,
            alteration, and disclosure.
          </p>

          <h2>5. Changes to Our Privacy Policy</h2>
          <p>
            We may revise this Privacy Policy from time to time. The most
            current version of the policy will govern our processing of your
            personal data and will always be at this page.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at [Insert Contact Information].
          </p>

          <p>
            By using our services, you agree to the terms of this Privacy
            Policy. If you do not agree with any term in this Policy, please do
            not use our services.
          </p>
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
