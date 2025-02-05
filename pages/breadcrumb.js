import { useRouter } from "next/router";
import { capitalCase } from "change-case";

export default function Breadcrumb({ location, state, property, lid, pid }) {
  const router = useRouter();
  if (pid && property) {
    return (
      <div className="md:text-left md:text-base text-center text-sm font-light">
        <a href="/">Home</a>
        <p className="inline-block">&nbsp;&gt;&nbsp;</p>
        {property ? (
          <>
            <a
              onClick={() => router.push("/location/" + capitalCase(location))}
              className="cursor-pointer"
            >
              {capitalCase(location) + ", " + capitalCase(state)}
            </a>
            <p className="inline-block">&nbsp;&gt;&nbsp;</p>
            <a
              onClick={() =>
                router.push("/property/" + property + "?id=" + pid)
              }
              className="cursor-pointer text-slate-500"
            >
              {property}
            </a>
          </>
        ) : (
          <>
            <a
              onClick={() => router.push("/location/" + location)}
              className="cursor-pointer"
            >
              {capitalCase(location) + ", " + capitalCase(state)}
            </a>
          </>
        )}
      </div>
    );
  }
  return null;
}
