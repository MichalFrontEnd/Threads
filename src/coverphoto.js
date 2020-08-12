import React, { useEffect, useState } from "react";

export default function Coverphoto(props) {
    //console.log("props in coverPhoto", props);
    let { coverphoto } = props;
    let [randomCover, setRandomCover] = useState("");
    useEffect(() => {
        function randomnumber(num) {
            return Math.floor(Math.random() * num);
        }
        setRandomCover(randomnumber(13));
    }, []);

    coverphoto = coverphoto || `/images/${randomCover}.jpg`;
    return <img className="cover_photo" src={coverphoto} />;
}
