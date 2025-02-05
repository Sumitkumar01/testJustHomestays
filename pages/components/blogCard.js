import Image from "next/image";
import { useRouter } from "next/router";
import { format } from "date-fns";

export default function Blogcard(props) {
  const router = useRouter();

  function convertToArray(stringArray) {
    if (stringArray === null || stringArray === undefined) {
      return [];
    }

    const array = stringArray.substring(1, stringArray.length - 1).split(",");
    const trimmedArray = array.map((item) => item.trim().replace(/"/g, ""));
    return trimmedArray;
  }

  const stringArray = props.keywords || null;
  const resultArray = convertToArray(stringArray);

  if (props.slug)
    return (
      <a href={`/blogs/${props.slug}`}>
        <div
          key={props.key}
          className="bg-base-100 rounded-lg drop-shadow-lg flex flex-col gap-x-4"
        >
          <figure>
            <Image
              src={`https://test.justhomestay.in/${props.image}`}
              width={640}
              height={360}
              className="aspect-video rounded-t-lg"
              alt={props.alt || "Just home stay"}
            />
          </figure>
          <div className="w-full px-4 py-6 flex flex-col gap-4 text-left">
            <h2 className="text-lg font-bold">
              {props.title.length > 70
                ? `${props.title.slice(0, 70)}...`
                : props.title}
            </h2>
            <p className="text-sm">{`${format(
              new Date(props.date),
              "dd-MMM-yyyy"
            )}`}</p>
            <p className="text-sm text-light">
              {props.excerpt.length > 80
                ? `${props.excerpt.slice(0, 80)}...`
                : props.excerpt}<span className="text-dark capitalize border-b border-dark whitespace-nowrap">read more</span>
            </p>
            <p className="flex flex-wrap gap-2 text-light">
              {resultArray.map((keyword, index) => (
                <span className="px-2 py-1 max-md:p-2 rounded-lg bg-[#F0EDEE]" key={index}>
                  {keyword}
                </span>
              ))}
            </p>
          </div>
        </div>
      </a>
    );
  else null;
}
