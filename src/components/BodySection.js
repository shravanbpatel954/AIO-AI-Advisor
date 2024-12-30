import React, { useState } from 'react';
import './BodySection.css';
import { FaInstagram, FaWhatsapp, FaLinkedin } from 'react-icons/fa'; // Importing icons for social links

const BodySection = ({ openAuthModal }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a WhatsApp message link
    const phoneNumber = '+918104479942'; // Replace with your target phone number
    const message = `Name: ${contactForm.name}\nEmail: ${contactForm.email}\nMessage: ${contactForm.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp link in a new tab
    window.open(whatsappLink, '_blank');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <main>
      <section id="home" className="home-section"></section>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Get Tailored Advice with AIO</h1>
            <p>Unlock expert advice in various fields such as legal, financial, tech, health, and more—all powered by AI.</p>
            <button onClick={() => openAuthModal('signin')} className="cta-button">Get Started</button>
          </div>
          <div className="hero-image">
            <video
              src={require('./assets/hero.mp4')} // Adjust the path based on your folder structure
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }} // Adjust styles as needed
            />
          </div>
        </div>
        <div className="floating-shapes">
          <span className="shape"></span>
          <span className="shape"></span>
          <span className="shape"></span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2>Key Features of AIO</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>AI-Powered Advisors</h3>
              <p>Leverage the power of AI-driven advisor models to receive expert advice across various fields like legal, financial, health, and more.</p>
            </div>
            <div className="feature-item">
              <h3>Personalized Input</h3>
              <p>Provide specific inputs such as your situation, location, language, and preferences to receive highly relevant, personalized advice.</p>
            </div>
            <div className="feature-item">
              <h3>Instant Responses</h3>
              <p>Get real-time, actionable advice at any time, helping you make quick decisions in various areas like career planning or financial management.</p>
            </div>
            <div className="feature-item">
              <h3>Secure and Private</h3>
              <p>Your data is safe and your consultations are private, ensuring complete confidentiality when interacting with the advisor models.</p>
            </div>
            <div className="feature-item">
              <h3>Multiple Advisory Areas</h3>
              <p>Whether it's law, finance, health, or tech, AIO provides access to a diverse range of expert models for all your needs.</p>
            </div>
            <div className="feature-item">
              <h3>Easy Access</h3>
              <p>Access the platform anytime, from anywhere, on any device, and receive tailored advice based on your input for convenience and accessibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2>How AIO Works</h2>
          <div className="steps">
            <div className="step">
              <h3>Step 1: Sign Up</h3>
              <p>Create your account or sign in with Google to access personalized advisory services.</p>
            </div>
            <div className="step">
              <h3>Step 2: Select an Advisor Model</h3>
              <p>Choose the advisor model you need (e.g., legal, financial, health) and provide the necessary inputs (situation, language, etc.).</p>
            </div>
            <div className="step">
              <h3>Step 3: Receive Advice</h3>
              <p>Get tailored advice from the AI-based advisor, based on your input and preferences, in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="solutions-section">
        <div className="container">
          <h2>Our Solutions</h2>
          <div className="solutions-list">
            <div className="solution-item">
              <h3>Legal Advisor</h3>
              <p>Receive legal advice on various matters such as contracts, rights, and dispute resolution, all provided by our specialized AI legal advisor.</p>
            </div>
            <div className="solution-item">
              <h3>Financial Advisor</h3>
              <p>Get expert financial advice for budgeting, investing, tax planning, and more, using our AI financial advisor model.</p>
            </div>
            <div className="solution-item">
              <h3>Health Advisor</h3>
              <p>Access AI-driven health advice on wellness, diet, exercise, and medical inquiries, powered by our health advisor model.</p>
            </div>
            <div className="solution-item">
              <h3>Career Advisor</h3>
              <p>Prepare for job interviews, career growth, and professional advice from our AI-powered career advisor model, designed to help you succeed.</p>
            </div>
            <div className="solution-item">
              <h3>Tech Advisor</h3>
              <p>Get personalized technical advice on software development, IT solutions, and emerging technologies from our AI tech advisor model.</p>
            </div>
            <div className="solution-item">
              <h3>Travel Advisor</h3>
              <p>Plan your next trip with customized travel advice, including destinations, itineraries, and budget recommendations from our AI travel advisor.</p>
            </div>
            <div className="solution-item">
              <h3>Academic Advisor</h3>
              <p>Get advice on academic courses, college applications, research, and scholarships, provided by our AI academic advisor model.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
  <div className="container">
    <h2>About AIO </h2>
    <p>
      <strong>AIO</strong>, which stands for <strong>All In One</strong>, is an innovative AI-powered advisory platform developed and designed by <strong><u><em>Shravan B. Patel</em></u></strong>. AIO is built to offer expert advice and personalized solutions across a wide range of fields, making it a versatile and all-encompassing resource. Whether you are seeking advice for your career, legal matters, academic pursuits, financial planning, health recommendations, or even travel, AIO brings the expertise to your fingertips, powered by advanced AI technology.
    </p>
    <p>
      At AIO, we understand that every individual’s needs are unique. That's why our platform leverages state-of-the-art AI models tailored to different domains. These models analyze user inputs and provide precise and actionable advice that is relevant to the specific context. From financial strategies, legal guidance, health tips, and academic counseling to entertainment suggestions, AIO ensures that every user receives personalized recommendations that are in tune with their individual situation.
    </p>
    <p>
      With AIO, users gain access to a secure and user-friendly platform where expert knowledge is always just a few clicks away. Whether you're navigating the complexities of finance, seeking career growth tips, planning your next vacation, or looking for guidance on your health, AIO offers real-time solutions that are grounded in deep AI-powered insights.
    </p>
    <p>
      Our AI models span across a variety of fields:
      <ul>
        <li><strong>Legal:</strong> Get accurate, reliable legal advice tailored to your situation, from contract analysis to understanding your rights.</li>
        <li><strong>Travel:</strong> Receive personalized travel recommendations, itineraries, and tips for a seamless and enriching journey.</li>
        <li><strong>Tech:</strong> Stay ahead with expert advice on the latest technological innovations and how they can benefit you.</li>
        <li><strong>Entertainment:</strong> Discover new movies, music, shows, and events that match your interests and preferences.</li>
        <li><strong>Academics:</strong> Access guidance for academic planning, college selection, and strategies to improve learning and grades.</li>
        <li><strong>Career:</strong> Find career advancement advice, resume tips, and interview preparation to help you succeed in your professional life.</li>
        <li><strong>Financial:</strong> Make smart financial decisions, get investment tips, budgeting advice, and planning strategies for your financial future.</li>
      </ul>
    </p>
    <p>
      By consolidating multiple domains into one platform, AIO eliminates the need for multiple separate services. Everything you need to thrive in life, from personal development to professional growth, is now in one place. Our AI models are continuously improving to ensure that they remain at the cutting edge of innovation, delivering the most accurate and useful information to our users.
    </p>
    <p>
      <strong>AIO - All In One</strong> is more than just a tool; it’s a personalized assistant that helps you navigate the complexities of life. Our mission is to provide you with the best advice possible, tailored to your specific needs, whenever you need it. With AIO, expert knowledge is no longer out of reach – it's available 24/7, empowering you to make informed decisions and enhance every aspect of your life.
    </p>
    <p>
      Developed and designed by <strong><u><em>Shravan B. Patel</em></u></strong>, AIO represents a fusion of cutting-edge technology, user-centered design, and a passion for making expert advice accessible to all. With AIO, you have an AI advisor who works for you, ready to assist you in making smarter, more informed decisions.
    </p>
  </div>
</section>



      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
            
          </form>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Get Expert Advice Anytime with AIO</h2>
          <p>Sign up now to start receiving tailored advice from our AI-powered advisors in various fields!</p>
          <button onClick={() => openAuthModal('signup')} className="cta-button">Sign Up Now</button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="social-links">
            <a href="https://www.instagram.com/shravan___1809/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/918104479942" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
              <FaWhatsapp />
            </a>
            <a href="https://www.linkedin.com/in/shravan-kumar-patel" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
              <FaLinkedin />
            </a>
          </div>
          <p>© 2024 AIO. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default BodySection;
