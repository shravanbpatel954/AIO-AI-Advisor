import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './travel.css'; // Custom CSS for travel
import Markdown from 'react-markdown';
import { saveUserData } from '../components/firebase'; // Assuming saveUserData is a function to save data to Firebase
import YouTube from 'react-youtube'; // Import YouTube player library

// Form Component
const Form = ({
  country,
  situation,
  language,
  travelStartDate,
  travelEndDate,
  preferences,
  onCountryChange,
  onSituationChange,
  onLanguageChange,
  onStartDateChange,
  onEndDateChange,
  onPreferencesChange,
  onGenerateResponse,
  isLoading,
}) => {
  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '100px',
    resize: 'vertical',
  };

  const dateContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  return (
    <div className="form-container">
      <div className="input-section">
        <label>Select Country:</label>
        <select value={country} onChange={(e) => onCountryChange(e.target.value)} style={inputStyle}>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Australia">Australia</option>
        </select>
        <br />
        <label>Select Language:</label>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)} style={inputStyle}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="hin">Hinglish</option>
          <option value="mr">Marathi</option>
          <option value="gu">Gujarati</option>
        </select>
        <br />
        <label>Describe Travel Situation:</label>
        <textarea
          placeholder="Provide details about your travel situation..."
          value={situation}
          onChange={(e) => onSituationChange(e.target.value)}
          style={textareaStyle}
        ></textarea>
        <br />
        <div style={dateContainerStyle}>
          <div>
            <label>Travel Start Date:</label>
            <input
              type="date"
              value={travelStartDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Travel End Date:</label>
            <input
              type="date"
              value={travelEndDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <br />
        <label>Travel Preferences (e.g., adventure, relaxation):</label>
        <input
          type="text"
          value={preferences}
          onChange={(e) => onPreferencesChange(e.target.value)}
          style={inputStyle}
        />
        <br />
        <button onClick={onGenerateResponse} disabled={isLoading || !situation}>
          Generate Travel Advice
        </button>
      </div>
    </div>
  );
};

// Response Component
const Response = ({ response, youtubeLinks, isLoading, onSave}) => {
  const youtubeOptions = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  return (
    <div className="output-section">
      {isLoading ? (
        <div className="loading-box">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
          <span>Generating your travel advice...</span>
        </div>
      ) : (
        <div id="response-container">
          <h2>Travel Advisor says:</h2>
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
                  />
                </div>
              );
            })}
          </div>
          <button className="save-button" onClick={onSave} disabled={!response || youtubeLinks.length === 0}>
            Save to MyAIO
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

// Main Travel Component
const Travel = () => {
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('India');
  const [language, setLanguage] = useState('en');
  const [travelStartDate, setTravelStartDate] = useState('');
  const [travelEndDate, setTravelEndDate] = useState('');
  const [preferences, setPreferences] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links

  const genAI = new GoogleGenerativeAI('AIzaSyDC22GRNHggs2RL1CXtPQwsCdxtUmBuIY8'); // Replace with your actual API key

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);
      const prompt = `You are a travel advisor. The travel situation is: ${situation}. Travel start date: ${travelStartDate}. Travel end date: ${travelEndDate}. Preferences: ${preferences}. Provide travel advice for ${country} in ${language}.`;
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

  // Fetch YouTube Videos based on the situation
  const fetchYoutubeVideos = async (situation, language) => {
    const apiKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0'; // Replace with your YouTube API Key
    const searchQuery = `${situation} travel advice ${language}`;
    const maxResults = 5;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=${maxResults}&key=${apiKey}`
      );
      const data = await response.json();
      const videoLinks = data.items.map((item) => `https://www.youtube.com/watch?v=${item.id.videoId}`);
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
      travelStartDate,
      travelEndDate,
      preferences,
      advice: response,
      youtubeLinks,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveUserData(dataToSave); // Assuming this function saves data to Firebase
      alert('Travel advice and videos saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save travel advice.');
    }
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <h1>
          <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '36px' }} className="travel">
            Travel-
          </span>
          <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '36px' }} className="advisor">
            Advisor
          </span>
        </h1>
      </div>
      <div className="content">
        <Form
          country={country}
          situation={situation}
          language={language}
          travelStartDate={travelStartDate}
          travelEndDate={travelEndDate}
          preferences={preferences}
          onCountryChange={setCountry}
          onSituationChange={setSituation}
          onLanguageChange={setLanguage}
          onStartDateChange={setTravelStartDate}
          onEndDateChange={setTravelEndDate}
          onPreferencesChange={setPreferences}
          onGenerateResponse={handleGenerateResponse}
          isLoading={isLoading}
        />
        <Response
          response={response}
          youtubeLinks={youtubeLinks}
          isLoading={isLoading}
          onSave={handleSave}
        />
      </div>
      <MadeBy />
    </div>
  );
};

export default Travel;
