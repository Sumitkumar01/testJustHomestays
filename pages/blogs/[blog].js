import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import Axios from "axios";
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookIcon,
  EmailIcon,
  WhatsappIcon,
  TelegramIcon,
  TwitterIcon,
} from "react-share";
import Footer from "../Footer.jsx";
import Header from "../header";
import Sidebar from "./BlogSidebar";
import Head from "next/head";
import { SmallBackBtn } from "../../util/icons";
import Link from "next/link";

export async function getServerSideProps({ req, res, resolvedUrl }) {
  var string = resolvedUrl.substring(1);
  var id = string.replace("blogs/", "");

  const { data } = await Axios.get(process.env.API_URL + "Blogs", {
    params: { where: "(slug,eq," + id + ")" },
    headers: { "xc-token": process.env.API_KEY },
  });
  return { props: { data } };
}

export default function Blog1({ data }) {
  const blogs = data.list[0];
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUrl(window.location.href);
    if (!data.list && router) {
      router.push("./404");
    }
  }, []);

  const structure = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    headline: blogs.Title,
    url: `https://justhomestay.in${router.pathname}`,
    logo: `https://justhomestay.in/logo_main.webp`,
    image: `https://test.justhomestay.in/${blogs.Image}`,
    description: `${blogs.Title} by Just Home Stay`,
    telephone: "+919810325245",
    editor: "JustHomeStay",
    keywords: blogs.Keywords,
    datePublished: blogs.PublishDate,
    dateCreated: blogs.PublishDate,
    dateModified: blogs.UpdatedAt,
    articleBody: blogs.Content,
  };

  if (blogs && url) {
    return (
      <div className="flex justify-center">
        <Head>
          <title>{`${blogs.Title} | Just Home Stay`}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="description" content={`${blogs.Excerpt}`} />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`${blogs.Title} | Just Home Stay`}
          />
          <meta property="og:description" content={`${blogs.Excerpt}`} />
          <meta
            property="og:url"
            content={`https://justhomestay.in/blogs/${blogs.slug}`}
          />
          <meta
            property="og:image"
            content={`https://test.justhomestay.in/${blogs.Image}`}
          />
          <link
            rel="canonical"
            href={`https://justhomestay.in/blogs/${blogs.slug}`}
          />
          <script
            key="structure"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON?.stringify(structure) }}
          />
          <meta charSet="UTF-8" />
        </Head>
        <div className="lg:w-[1140px] w-full xl:px-0 px-4">
          <Header />
          {/* <button className="btn btn-ghost" onClick={() => router.back()}>
            {"< All Blogs"}
          </button> */}
          <p className="flex lg:hidden gap-2 text-light text-sm w-full items-center capitalize">
            <Link href="/">home</Link>
            <span className="mt-1">
              <SmallBackBtn />
            </span>
            <Link href="/blogs">Our Blogs</Link>
            <span className="mt-1">
              <SmallBackBtn />
            </span>
            <span>{blogs.Title.substring(0, 17)} ...</span>
          </p>
          <div className="flex gap-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4 gap-y-4">
              <div className="grid col-span-1 md:col-span-4 mb-auto">
                <Image
                  src={
                    blogs.Image.length != 0
                      ? `https://test.justhomestay.in/${blogs.Image}`
                      : ""
                  }
                  className="rounded-2xl drop-shadow-xl w-full aspect-video"
                  alt={blogs.ImageAlt || "Just home stay"}
                  width={800}
                  height={450}
                />
                <h1 className="text-2xl md:text-3xl font-bold py-4 text-normal lg:text-primary">
                  {blogs.Title}
                </h1>
                <div className="lg:flex hidden gap-4 my-2">
                  <div className="flex">
                    <div className="flex gap-x-2">
                      <div className="text-center w-full">
                        <FacebookShareButton url={url} children="">
                          <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                      </div>
                      <div className="text-center">
                        <EmailShareButton url={url} children="">
                          <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                      </div>
                      <div className="text-center">
                        <WhatsappShareButton url={url} children="">
                          <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton>
                      </div>
                      <div className="text-center">
                        <TelegramShareButton url={url} children="">
                          <TelegramIcon size={32} round={true} />
                        </TelegramShareButton>
                      </div>
                      <div className="text-center">
                        <TwitterShareButton url={url} children="">
                          <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                      </div>
                      <div className="text-center">
                        <FacebookMessengerShareButton url={url} children="">
                          <FacebookMessengerIcon size={32} round={true} />
                        </FacebookMessengerShareButton>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="h-px w-full lg:block hidden bg-slate-800 my-2"></span>
                <p
                  className="text-lg mb-auto"
                  dangerouslySetInnerHTML={{ __html: blogs?.Content }}
                />
                <br />
              </div>
              <div className="grid col-span-1">
                <Sidebar />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
