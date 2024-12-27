import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './carrer.css'; // Add your custom CSS here
import Markdown from 'react-markdown';
import { saveUserData } from '../components/firebase'; // Assuming saveUserData is a function to save data to Firebase
import YouTube from 'react-youtube'; // Import YouTube player library

// Form Component
const Form = ({ country, situation, language, onCountryChange, onSituationChange, onLanguageChange, onGenerateResponse, isLoading }) => {
  return (
    <div className="form-container">
      <div className="input-section">
        <label>Select Country:</label>
        <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>
        <br />
        <label>Select Language:</label>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
           <option value="hi">Hindi</option>
          <option value="hin">Hinglish</option>
          <option value="mr">Marathi</option>
          <option value="gu">Gujarati</option>
        </select>
        <br />
        <label>Describe Career Situation:</label>
        <textarea
          rows="4"
          cols="50"
          placeholder="Provide details about your dream..."
          value={situation}
          onChange={(e) => onSituationChange(e.target.value)}
        ></textarea>
        <br />
        <button onClick={onGenerateResponse} disabled={isLoading || !situation}>Generate Response</button>
      </div>
    </div>
  );
};

// Response Component
const Response = ({ response, isLoading, youtubeLinks, onSave }) => {
  const youtubeOptions = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0, // Disable autoplay
      controls: 1, // Show controls
    },
  };

  const handleVideoPlay = (event) => {
    console.log('Video is playing');
  };

  const handleVideoPause = (event) => {
    console.log('Video is paused');
  };

  return (
    <div className="output-section">
      {isLoading ? (
        <div className="loading-box">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
          <span>Generating your career advice...</span>
        </div>
      ) : (
        <div id="response-container">
          <h2>Career Advisor says:</h2>
          <Markdown>{response}</Markdown>
          <h3>Recommended YouTube Videos:</h3>
          <div className="youtube-videos">
            {youtubeLinks.map((link, index) => {
              const videoId = link.split('v=')[1]; // Extract the video ID
              return (
                <div key={index} className="youtube-video-container">
                  <YouTube
                    videoId={videoId}
                    opts={youtubeOptions}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="save-button"
            onClick={onSave}
            disabled={!response || youtubeLinks.length === 0}
          >
            Save MyAIO
          </button>
        </div>
      )}
    </div>
  );
};

// MadeBy Component
const MadeBy = () => (
  <div className="made-by">
    Designed and Developed by <strong>Shravan.B.Patel</strong>
  </div>
);

// Main Career Advisor Component
const Career = () => {
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('India');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links

  const genAI = new GoogleGenerativeAI('AIzaSyDC22GRNHggs2RL1CXtPQwsCdxtUmBuIY8'); // Replace with your actual API key

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a career advisor. The situation is: ${situation}. Provide career advice for ${country} in ${language}. Include actionable steps and suggestions for improvement.`;
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      setResponse(generatedResponse);

      // Fetch YouTube links based on the situation
      await fetchYoutubeVideos(situation, language);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch YouTube Videos
  const fetchYoutubeVideos = async (situation, language) => {
    const apiKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0'; // Replace with your YouTube API Key
    const searchQuery = `${situation} career advice ${language}`;
    const maxResults = 5;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=${maxResults}&key=${apiKey}`
      );
      const data = await response.json();
      const videoLinks = data.items.map(
        (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
      );
      setYoutubeLinks(videoLinks);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  // Save user data to the database
  const handleSave = async () => {
    const dataToSave = {
      country,
      situation,
      language,
      advice: response,
      youtubeLinks,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveUserData(dataToSave); // Assuming this function saves data to Firebase
      alert('Career advice and videos saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save career advice.');
    }
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <h1>
          <span
            style={{
              fontWeight: 'bold',
              color: '#007bff', // Blue for 'Career'
              fontSize: '36px',
            }}
            className="career"
          >
            Career-
          </span>
          <span
            style={{
              fontWeight: 'bold',
              color: '#28a745', // Green for 'Advisor'
              fontSize: '36px',
            }}
            className="advisor"
          >
            Advisor
          </span>
        </h1>
      </div>
      <div className="content">
        <Form
          country={country}
          situation={situation}
          language={language}
          onCountryChange={setCountry}
          onSituationChange={setSituation}
          onLanguageChange={setLanguage}
          onGenerateResponse={handleGenerateResponse}
          isLoading={isLoading}
        />
        <Response
          response={response}
          isLoading={isLoading}
          youtubeLinks={youtubeLinks}
          onSave={handleSave}
        />
      </div>
      <MadeBy />
    </div>
  );
};

export default Career;
