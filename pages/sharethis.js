import React, { useState } from "react";
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
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsXLg } from "react-icons/bs";

export default function SThis(props) {
  const [copy, setCopy] = useState(false);
  function close() {
    props.from(false);
    setCopy("");
  }
  if (props.open) {
    return (
      <div className="backdrop justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="modal-box md:p-4 p-2 text-right">
          <div className="flex justify-end">
            <button
              className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center"
              onClick={() => close()}
            >
              <BsXLg className="h-6 w-6" />
            </button>
          </div>
          <p className="font-bold text-center text-lg">Share {props.prop}</p>
          <div className="p-2 mt-2">
            <div className="grid md:grid-cols-6 grid-cols-3 mx-auto text-center gap-2 justify-center">
              <div className="grid col-span-1 text-center">
                <FacebookShareButton url={props.url} children="">
                  <FacebookIcon className="rounded-full mx-auto md:mx-0" />
                </FacebookShareButton>
              </div>
              <div className="grid col-span-1 text-center">
                <EmailShareButton url={props.url} children="">
                  <EmailIcon className="rounded-full mx-auto md:mx-0" />
                </EmailShareButton>
              </div>
              <div className="grid col-span-1 text-center">
                <WhatsappShareButton url={props.url} children="">
                  <WhatsappIcon className="rounded-full mx-auto md:mx-0" />
                </WhatsappShareButton>
              </div>
              <div className="grid col-span-1 text-center">
                <TelegramShareButton url={props.url} children="">
                  <TelegramIcon className="rounded-full mx-auto md:mx-0" />
                </TelegramShareButton>
              </div>
              <div className="grid col-span-1 text-center">
                <TwitterShareButton url={props.url} children="">
                  <TwitterIcon className="rounded-full mx-auto md:mx-0" />
                </TwitterShareButton>
              </div>
              <div className="grid col-span-1 text-center">
                <FacebookMessengerShareButton url={props.url} children="">
                  <FacebookMessengerIcon className="rounded-full mx-auto md:mx-0" />
                </FacebookMessengerShareButton>
              </div>
            </div>
          </div>
          <div className="px-2 mt-2 justify-start text-left">
            <input
              type="text"
              value={props.url}
              className="md:w-[90%] w-[80%] input text-left inline-block"
              disabled
            />
            <CopyToClipboard
              className="inline-block w-8 ml-2 cursor-pointer"
              text={props.url}
              onCopy={() => setCopy(true)}
            >
              <ClipboardDocumentIcon className="cursor-pointer" />
            </CopyToClipboard>
            {copy ? <p className="text-sm">Copied!</p> : <p></p>}
          </div>
        </div>
      </div>
    );
  }
}
