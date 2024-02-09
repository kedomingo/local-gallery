"use client"

import Gallery from "@/app/gallery";
import {useEffect, useState} from "react";

export const SERVER = 'http://192.168.0.145:8080';

export default function Home() {

    const [currentPath, setCurrentPath] = useState('');
    const [imageData, setImageData] = useState({dirs:[], files: []});

    const reloadData = (path: string) => {
        setCurrentPath(path);
        fetch(SERVER + '/?path=' + encodeURIComponent(path))
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setImageData(data);
            });
    }

    useEffect(() => {
        reloadData('/');
    }, []);

    return (
        <Gallery imageData={imageData} reloadData={reloadData} currentPath={currentPath}
                 key={currentPath + "" + (imageData?.files ?? []).length}
        />
    );
}
