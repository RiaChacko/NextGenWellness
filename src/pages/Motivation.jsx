import React, { useState } from "react";
import "../pages/Motivation.css";
import Navbar from "./Navbar";

function Motivation () {
    const [images, setImages] = useState([]);
    const [progressImages, setProgressImages] = useState([]);

    // Handle file change for motivation images/videos
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    // Handle file change for progress images/videos
    const handleProgressFileChange = (e) => {
        const files = Array.from(e.target.files);
        setProgressImages((prevImages) => [...prevImages, ...files]);
    };

    // Render uploaded images for motivation section
    const renderImages = (imagesArray) => {
        return imagesArray.map((file, index) => (
            <div key={index} className="image-box">
                <img src={URL.createObjectURL(file)} alt={`uploaded ${index}`} />
            </div>
        ));
    };

    const [showWhyForm, setShowWhyForm] = useState(false);
    const [showMotivationForm, setShowMotivationForm] = useState(false);
    const [whyInput, setWhyInput] = useState("");
    const [motivationalQuote, setMotivationalQuote] = useState("");

    const toggleWhyForm = () => {
        setShowWhyForm(!showWhyForm);
    };

    const toggleMotivationForm = () => {
        setShowMotivationForm(!showMotivationForm);
    };

    const handleWhySubmit = (e) => {
        e.preventDefault();
        setShowWhyForm(false); 
        setWhyInput(""); 
    };


    const handleMotivationSubmit = (e) => {
        e.preventDefault();
        setShowMotivationForm(false); 
        setMotivationalQuote(""); 
    };

    return(
        <div className="motivation-pg-container">
            <Navbar/>
            <h2>MOTIVATION</h2>
            <div className="why-motivaton-containers">
                <div className="why-container">
                    <h3>ADD YOUR WHY</h3>
                    <p>Why are you working out? What’s the passion behind it?</p>
                    <button onClick={toggleWhyForm}>Add Your Why</button>
                    {showWhyForm && (
                        <form onSubmit={handleWhySubmit}>
                            <input
                                type="text"
                                placeholder="Enter your reason..."
                                value={whyInput}
                                onChange={(e) => setWhyInput(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
                <div className="motivation-container">
                    <h3>ADD MOTIVATIONAL QUOTES</h3>
                    <p>What quotes pique your motivation to workout?</p>
                    <button onClick={toggleMotivationForm}>Add Motivational Quote</button>
                    {showMotivationForm && (
                        <form onSubmit={handleMotivationSubmit}>
                            <input
                                type="text"
                                placeholder="Enter your motivational quote..."
                                value={motivationalQuote}
                                onChange={(e) => setMotivationalQuote(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
            </div>
            {/* <div className="motivation-image-section">
                <h2>Motivation Images & Videos</h2>
                <p>Upload images and videos that motivate you that you can look back and reflect upon.</p>
                <div className="upload-pics-motivation">
                    {renderImages(images)}
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

            <div className="progress-so-far-section">
                <h2>Your Progress So Far</h2>
                <p>Upload images and videos of your progress so far.</p>
                <div className="upload-pics-progress">
                    {renderImages(progressImages)}
                    <div className="image-box">
                        <label className="upload-label">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleProgressFileChange}
                                multiple
                                hidden
                            />
                            <span className="plus-sign">+</span>
                        </label>
                    </div>
                </div>
            </div> */}
            {/* <button className="motivation-submit">SUBMIT</button> */}
        </div>
    );
}

export default Motivation;
