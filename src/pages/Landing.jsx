
import "./Landing.css";
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import svglogo from "../assets/Icon.svg";
import heroPic from "../assets/landingpic2.png";
import dashboard from "../assets/dashboard.png";
import motivation from "../assets/motivation.png";
import fitnessplan from "../assets/fitnessplan.png";
import goalsetting from "../assets/goalsetting.png";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function Landing() {

    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path); 
    };

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !message.trim()) {
            alert("Please enter both email and message.");
            return;
        }
    
        try {
            await addDoc(collection(db, "contactEmails"), {
                email: email,
                message: message,
                timestamp: new Date()
            });
    
            alert("Thank you for subscribing!");
            setEmail("");
            setMessage(""); 
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return(
        <div className="landing-container">
            <div className="navbar">
                <div className="logo-name">
                    <img src={svglogo}></img>
                    <div className="title-la">
                        <h1 className="pink-la">NEXT-GEN&nbsp;</h1>
                        <h1 className="blue-la">WELLNESS</h1>
                    </div>
                </div>
                <div className="nav-links">
                    <a>Home</a>
                    <a href="#features">Features</a>
                   <Link to="/signup"><a>Sign up</a></Link> 
                   <Link to="/login"><a>Login</a></Link>
                    <a href="#our-team">Our Team</a>
                    <a href="#contact-us">Contact Us</a>
                </div>

            </div>

            <div className="hero-section">
                <h1>YOUR WELLNESS REIMAGINED</h1>
                <h3>Next-gen tools for next-level fitness. Track progress, stay accountable, and push your limits.</h3>
                <Link to="/signup"><button>GET STARTED</button></Link>
            </div>

            <div className="features">
                <h2 id="features">FEATURES</h2>
                <p>Discover the powerful features that make our interactive dashboard the ultimate tool for your fitness journey. Designed to help you stay motivated, track your progress, and achieve your goals, our dashboard brings all your fitness needs into one easy-to-use platform.</p>
                <div className="features-list">
                    <div className="individual-feature">
                        <img src={dashboard}></img>
                        <div className="title-description-feature">
                        <h2>INTERACTIVE DASHBOARD</h2>
                        <p>A sleek, easy-to-navigate interface that provides a clear view of your workouts, performance, and achievements. Everything you need is just a click away.</p>
                        </div>
                    </div>
                    <div className="individual-feature">
                        <div className="title-description-feature-b">
                        <h2>MOTIVATION & SUPPORT</h2>
                        <p>Stay motivated with daily challenges, fitness quotes, and community engagement. Join our fitness community for extra support and encouragement along the way.</p>
                        </div>
                        <img src={motivation}></img>
                    </div>

                    <div className="individual-feature">
                        <img src={fitnessplan}></img>
                        <div className="title-description-feature">
                        <h2>PERSONALIZED FITNESS PLANS</h2>
                        <p>Get a tailored workout plan based on your fitness level and goals, whether you’re aiming to lose weight, build muscle, or improve endurance.</p>
                        </div>
                    </div>

                    <div className="individual-feature">
                        <div className="title-description-feature-b">
                        <h2>GOAL SETTING</h2>
                        <p>Achieving your fitness goals has never been easier. Our Goal Setting feature is designed to help you stay focused, motivated, and on track to reach your full potential.</p>
                        </div>
                        <img src={goalsetting}></img>
                    </div>
                </div>
            </div>


            <div className="features">
                <h2 id="our-team">OUR TEAM</h2>
                <div class="row">
                    <div class="profile">
                        <img src="https://media.licdn.com/dms/image/v2/D4E03AQHnsxOrsa7btg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725896993624?e=1750291200&v=beta&t=T-LtmzKNFomf-bEnnMwaxlTNuLkrAAXF1ITl8tACAps" alt="Person 1" class="headshot"></img>
                        <div class="name">Anushka Lakum</div>
                        <div class="role">Backend Developer</div>
                    </div>
                    <div class="profile">
                        <img src="https://media.licdn.com/dms/image/v2/D4E03AQFaSpceEhmHNA/profile-displayphoto-shrink_800_800/B4EZSaM5CWGYAo-/0/1737753859085?e=1750291200&v=beta&t=m39h-ThibVduWOQKtv8v9Gl-5-OcsuXc7hFiVnuTMQw" alt="Person 2" class="headshot"></img>
                        <div class="name">Akshat Rastogi</div>
                        <div class="role">Backend Develoepr</div>
                    </div>
                    <div class="profile">
                        <img src="https://media.discordapp.net/attachments/1309296703505043458/1336467682756661318/image.jpg?ex=67fe38c5&is=67fce745&hm=32fa30cf32a140eceb27502420b846d69e51d71762797de57bfc83e71dc0a6e5&=&format=webp&width=1451&height=1670" alt="Person 3" class="headshot"></img>
                        <div class="name">Anisha Paul</div>
                        <div class="role">Backend Developer</div>
                    </div>
                </div>

                <div class="row">
                    <div class="profile">
                        <img src="https://media.licdn.com/dms/image/v2/C4D03AQEFEN71BS9bPg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1651459684380?e=1750291200&v=beta&t=QcQlwTdIhBFqW13fdoQuOYaTRmrZtzDEWwN0MbuNHh0" alt="Person 4" class="headshot"></img>
                        <div class="name">Aneesha Acharya</div>
                        <div class="role">Frontend Developer</div>
                    </div>
                    <div class="profile">
                        <img src="https://media.licdn.com/dms/image/v2/D4E03AQEPhtXAFkhdcA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726113846459?e=1750291200&v=beta&t=0Jv6iiiqtEJtUKxUhS4gD6Uo8vS-46G7JuNK761Knx4" alt="Person 5" class="headshot"></img>
                        <div class="name">Ria Chacko</div>
                        <div class="role">Frontend Developer</div>
                    </div>
                </div>
            </div>

            

            <div className="contact-us-wrapper">
    <div className="contact-us" id="contact-us">
        <h2>Contact Us</h2>
        <p>If you have any questions or need assistance, reach out to us. We're here to help you on your fitness journey!</p>
        <div className="contact-form">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
            />
            <textarea
                placeholder="Let us know your thoughts..."
                value={message}
                onChange={handleMessageChange}
                rows={4}
                className="message-box"
            />
            <button onClick={handleEmailSubmit}>Subscribe</button>
        </div>
    </div>

    <div className="footer">
        <p>© 2025 Next-Gen Wellness. All rights reserved.</p>
    </div>
</div>
            
        </div>
        
    );
    
}

export default Landing