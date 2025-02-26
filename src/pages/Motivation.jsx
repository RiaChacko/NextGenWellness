import React, { useState } from "react";
import "../pages/Motivation.css";
import Navbar from "./Navbar";

function Motivation () {
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const renderImages = () => {
        return images.map((file, index) => (
            <div key={index} className="image-box">
                <img src={URL.createObjectURL(file)} alt={`uploaded ${index}`} />
            </div>
        ));
    };

    return(
        <div className="motivation-pg-container">
            <Navbar/>
            <h2>MOTIVATION</h2>
            <div className="why-motivaton-containers">
                <div className="why-container">
                    <h3>ADD YOUR WHY</h3>
                    <p>Why are you working out? What’s is the passion behind it?</p>
                    <button>Add Your Why</button>
                </div>
                <div className="motivation-container">
                    <h3>ADD MOTIVATIONAL QUOTES</h3>
                    <p>What quotes pique your motivation to workout?</p>
                    <button>Add Motivational Quote</button>
                </div>
            </div>
            <div className="motivation-image-section">
                <h2>Motivation Images & Videos</h2>
                <p>Upload images and videos that motivate you that you can look back and reflect upon.</p>
                <div className="upload-pics-motivation">
                    {renderImages()}
                    <div className="image-box">
                        <label className="upload-label">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                multiple
                                hidden
                            />
                            <span className="plus-sign">+</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Motivation;
