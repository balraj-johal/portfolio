import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Hook abstracting access of the URL path in Next.js application */
const useRouterURL = () => {
  const [url, setURL] = useState<string>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setURL(pathname + searchParams.toString());
  }, [pathname, searchParams]);

  return url;
};

export default useRouterURL;
