import "../styles/globals.scss";
import "slick-carousel/slick/slick.css";
import "../styles/slick-theme.css";
import "../styles/datepicker.css";
import "react-range-slider-input/dist/style.css";
import Aos from "aos";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import "intersection-observer";
import ReactGA from "react-ga4";
import styles from "../styles/management.css";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { MultiplierContext } from "../contexts/MultiplierContext";
import * as fbq from "../lib/fpixel";
import Script from "next/script";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "react-loading-skeleton/dist/skeleton.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const options = {
  method: "GET",
  url: "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Admin",
  params: { limit: "1", where: "", sort: "" },
  headers: {
    "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
  },
};

function MyApp({ Component, pageProps }) {
  const [multiplier, setMultiplier] = useState(null);

  useEffect(() => {
    const getMulti = async () => {
      try {
        const res = await axios.request(options);
        setMultiplier(res.data.list[0]["SV Multiplier"]);
      } catch (err) {
        console.error(err);
      }
    };

    ReactGA.initialize("G-4G0M3YY060");
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: window.location.pathname,
    });
    Aos.init();
    fbq.pageview();
    getMulti();
  }, []);

  return (
    <MultiplierContext.Provider value={multiplier}>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      />
      <Script
        id="fb-pixel2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID2});
          `,
        }}
      />
      <Component {...pageProps} />
    </MultiplierContext.Provider>
  );
}

export default MyApp;
