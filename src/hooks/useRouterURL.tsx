import { useEffect, useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";

/** Abstracts access of the URL path in Next.js application
 * @returns string: the full current pathname, including query params
 */
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
