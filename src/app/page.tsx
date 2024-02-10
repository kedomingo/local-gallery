"use client";

import Gallery from "@/app/gallery";
import { useEffect, useState } from "react";
import { SERVER } from "@/app/constants";
import { createQueryString } from "@/app/helpers";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | undefined };
};
export default function Home({ searchParams }: Props) {
  const [currentPath, setCurrentPath] = useState(searchParams?.path ?? "");
  const [imageData, setImageData] = useState({ dirs: [], files: [] });
  const pathname = usePathname();
  const router = useRouter();

  const reloadData = (path: string) => {
    setCurrentPath(path);

    const url = pathname + "?" + createQueryString({ path: path });
    router.push(url);

    fetch(SERVER + "/?path=" + encodeURIComponent(path))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setImageData(data);
      });
  };

  useEffect(() => {
    reloadData(currentPath);
  }, []);

  return (
    <Gallery
      imageData={imageData}
      reloadData={reloadData}
      currentPath={currentPath}
      key={currentPath + "" + (imageData?.files ?? []).length}
    />
  );
}
