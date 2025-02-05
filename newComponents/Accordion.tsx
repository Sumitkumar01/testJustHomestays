import React from "react";
import { DropDown } from "../util/icons";
interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col gap-4 group w-full">
      <div className="grid grid-cols-12 gap-4 items-center justify-between w-full">
        <div
          className="col-span-11 cursor-pointer"
          dangerouslySetInnerHTML={{ __html: title }}
        ></div>
        <span className="group-hover:-rotate-180 col-span-1 transition-transform duration-300 ease-in-out cursor-pointer flex w-full items-center justify-center">
          <span className="">
            <DropDown />
          </span>
        </span>
      </div>
      <div className="hidden group-hover:block">
        <div className="">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
