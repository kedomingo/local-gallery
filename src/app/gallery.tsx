"use client";

import { ReactElement, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Zoom } from "yet-another-react-lightbox/plugins";

import { SERVER } from "@/app/constants";

export default function Gallery({
  imageData,
  reloadData,
  currentPath,
}: {
  imageData: any;
  reloadData: any;
  currentPath: any;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [realIndex, setRealIndex] = useState(0);
  const [isOpen, setOpen] = useState(false);

  const renderDirs = (dirs: { path: string; thumbnail: string | null }[]) => {
    return dirs.map((dir) => (
      <div key={dir.path} className="basis-1/8 p-3">
        <a
          className="cursor-pointer"
          onClick={() => {
            setOpen(true);
            reloadData(dir.path);
          }}
        >
          {dir.thumbnail === "BACK" ? (
            <img src="/back.png" width={100} />
          ) : (
            <img
              src={
                SERVER +
                "/thumbnail.php?path=" +
                encodeURIComponent(dir.thumbnail ?? "")
              }
              alt={dir.path}
            />
          )}
        </a>
        <br />
        {dir.path.replace(/.*\/([^\/]+$)/, "$1").substring(0, 12)}
      </div>
    ));
  };

  const renderImageLinks = (images: string[]) => {
    const links: ReactElement[] = [];
    images.forEach((image, i) => {
      links.push(
        <a
          key={image}
          href="#"
          className={"block p-1 cursor-pointer"}
          onClick={() => openLightboxAtIndex(i)}
        >
          {image}
        </a>,
      );
    });
    return links;
  };

  const filterImages = (files: string[], showFrom: number, showTo: number) => {
    let count = 0;
    const newItems: string[] = [];
    files.forEach((file) => {
      if (!file.match(/\.jpg$/i)) {
        return <></>;
      }
      if (count >= showFrom && count <= showTo) {
        newItems.push(file);
      }
      count++;
    });
    return newItems;
  };

  const getItems = () => {
    return items.map((item) => {
      const url = SERVER + item.replace("#", "%23");
      return { src: url };
    });
  };

  const onWindowIndexChanged = (index: number) => {
    let realImageIndex = realIndex;
    if (index > currentIndex) {
      // sliding to the right
      realImageIndex = realIndex + 1;
    } else if (index < currentIndex) {
      // sliding to the left
      realImageIndex = realIndex - 1;
    }
    moveRealIndexTo(realImageIndex);
  };

  const moveRealIndexTo = (realIndex: number) => {
    setRealIndex(realIndex);

    // Get items to the left and right of the realIndex
    const useLeft = Math.max(0, realIndex - getHalfWindowSize());
    const useRight = Math.min(
      getAllImagesCount() - 1,
      realIndex + getHalfWindowSize(),
    );
    // setShowFrom(useLeft);
    // setShowTo(useRight);
    const newItems = filterImages(getAllImages(), useLeft, useRight);
    setItems(newItems);

    const effectiveIndexInWindow = realIndex - useLeft;
    setCurrentIndex(effectiveIndexInWindow);

    console.log("realImageIndex is now " + realIndex);
    console.log("index is now " + effectiveIndexInWindow);
  };

  const openLightboxAtIndex = (realIndex: number) => {
    moveRealIndexTo(realIndex);

    setOpen(true);
  };

  const isNearTheStart = (idx: number): boolean => {
    return idx < getHalfWindowSize();
  };

  const isNearTheEnd = (idx: number): boolean => {
    const distance = getDistanceFromEnd(idx);
    // If no images, distance is negative. malformed!

    return distance >= 0 && distance < getHalfWindowSize();
  };

  const getDistanceFromEnd = (idx: number): number => {
    return getAllImagesCount() - idx;
  };

  const getAllImagesCount = (): number => {
    return getAllImages().length;
  };

  const getAllImages = (): string[] => {
    return imageData?.files ?? [];
  };

  /**
   * Return the max number of items to the left or right of the currently selected image
   */
  const getHalfWindowSize = (): number => {
    return 5;
  };

  const [items, setItems] = useState(
    filterImages(getAllImages(), 0, getHalfWindowSize()),
  );

  return (
    <div>
      <div className="flex flex-wrap">{renderDirs(imageData?.dirs ?? [])}</div>
      <br />

      {items.length > 0 ? (
        <>
          <button onClick={() => setOpen(true)}>Open Gallery</button>
        </>
      ) : (
        <></>
      )}

      {renderImageLinks(getAllImages())}

      <div>
        <Lightbox
          plugins={[Zoom]}
          key={currentPath}
          open={isOpen}
          close={() => setOpen(false)}
          index={currentIndex}
          slides={getItems()}
          on={{
            view: ({ index }) => {
              onWindowIndexChanged(index);
            },
          }}
        />
      </div>
    </div>
  );
}
