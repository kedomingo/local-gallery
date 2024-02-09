"use client"

import {useState} from "react";
import Lightbox from "yet-another-react-lightbox";
import {Zoom} from "yet-another-react-lightbox/plugins";

import {SERVER} from "@/app/constants";

export default function Gallery({
                                    imageData,
                                    reloadData,
                                    currentPath
                                }: { imageData: any, reloadData: any, currentPath: any }) {

    const [currentIndex, setIndex] = useState(0);
    const [realIndex, setRealIndex] = useState(0);
    const [isOpen, setOpen] = useState(false);


    const filterImages = (files: string[]) => {
        let count = 0;
        const newItems: string[] = [];
        files.forEach((file) => {
            if (!file.match(/\.jpg$/)) {
                return <></>
            }
            if (count >= showFrom && count < showTo) {
                newItems.push(file);
            }
            count++;
        });
        return newItems;
    }

    const [showFrom, setShowFrom] = useState(0);
    const [showTo, setShowTo] = useState(5);
    const [items, setItems] = useState(filterImages(imageData?.files ?? []));

    const renderDirs = (dirs: { path: string, thumbnail: string | null }[]) => {
        return dirs.map((dir) =>
            (<div key={dir.path} className="basis-1/8 p-3">
                <a className="cursor-pointer" onClick={() => {
                    setOpen(true);
                    reloadData(dir.path);
                }}>
                    {dir.thumbnail === 'BACK' ? (<img src="/back.png" width={100}/>) : (
                        <img src={SERVER + "/thumbnail.php?path=" + encodeURIComponent(dir.thumbnail ?? '')}
                             alt={dir.path}/>)}

                </a>
                <br/>
                {dir.path.replace(/.*\/([^\/]+$)/, '$1').substring(0, 12)}
            </div>)
        );
    }

    const changeItems = (index: number) => {

        let realImageIndex = realIndex;
        if (index > currentIndex) {
            // sliding to the right
            realImageIndex = realIndex + 1;
        } else if (index < currentIndex) {
            // sliding to the left
            realImageIndex = realIndex - 1;
        }
        setRealIndex(realImageIndex);

        // Fix to center of array
        if (realImageIndex >= 5 && realImageIndex <= (imageData?.files?.length ?? 5)) {
            index = 5;
        }
        setIndex(index);


        console.log("realImageIndex is now " + realImageIndex);
        console.log("index is now " + index);

        setShowFrom(Math.max(0, (realImageIndex ?? 0) - 5));
        setShowTo(Math.min(imageData?.files?.length ?? 0, (realImageIndex ?? 0) + 5));
        const newItems = filterImages(imageData?.files ?? []);
        setItems(newItems);
    }

    const getItems = () => {
        return items.map((item) => {
            const url = SERVER + item.replace('#', '%23');
            return {src: url};
        });
    };

    return (
        <div>
            <div className="flex flex-wrap">{renderDirs(imageData?.dirs ?? [])}</div>
            <br/>

            {items.length > 0 ? (<button onClick={() => setOpen(true)}>Open Gallery</button>) : <></>}

            <div>

                <Lightbox
                    plugins={[Zoom]}
                    key={currentPath}
                    open={isOpen}
                    close={() => setOpen(false)}
                    index={currentIndex}
                    slides={getItems()}
                    on={{
                        view: ({index}) => {
                            changeItems(index);
                        }
                    }}
                />

            </div>
        </div>
    );
}
