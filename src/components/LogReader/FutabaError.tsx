import { useState, useEffect } from 'react';
import errorImg1 from '../../assets/error/1.png';
import errorImg2 from '../../assets/error/2.png';
import errorImg3 from '../../assets/error/3.png';
import errorImg4 from '../../assets/error/4.png';
import './FutabaError.css';

const errorImages = [errorImg1, errorImg2, errorImg3, errorImg4];

export const FutabaError = () => {
    const [randomImg, setRandomImg] = useState(0);

    useEffect(() => {
        const idx = Math.floor(Math.random() * errorImages.length);
        setRandomImg(idx);
    }, []);

    return (
        <div className="futaba-error">
            <img src={errorImages[randomImg]} alt="Nothing here" />
        </div>
    );
};
