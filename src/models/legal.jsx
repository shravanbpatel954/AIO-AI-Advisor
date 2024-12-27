import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './legal.css';
import Markdown from 'react-markdown';
import { saveUserData } from '../components/firebase'; // Assuming saveUserData is a function to save data to Firebase
import html2canvas from 'html2canvas';
import YouTube from 'react-youtube'; // Import YouTube player library

// Form Component (same as in your code)
const Form = ({ country, state, situation, language, onCountryChange, onStateChange, onSituationChange, onLanguageChange, onGenerateResponse, isLoading }) => {
  const statesIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="form-container">
      <div className="input-section">
        <label>Select Country:</label>
        <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
          <option value="India">India</option>
          <option value="Australia">Australia</option>
          <option value="United States of America">United States of America</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Bangladesh">Bangladesh</option>
        </select>
        <br />
        
        {country === "India" && (
          <>
            <label>Select State:</label>
            <select value={state} onChange={(e) => onStateChange(e.target.value)}>
              {statesIndia.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
            <br />
          </>
        )}

        <label>Select Language:</label>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="hin">Hinglish</option>
          <option value="mr">Marathi</option>
          <option value="gu">Gujarati</option>
          <option value="es">Spanish</option>
        </select>
        <br />

        <label>Describe the Legal Situation:</label>
        <textarea
          rows="4"
          cols="50"
          placeholder="Provide details about your Legal situation..."
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

  return (
    <div className="output-section">
      {isLoading ? (
        <div className="loading-box">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
          <span>Generating your advice...</span>
        </div>
      ) : (
        <div id="response-container">
          <h2>Legal Advisor says:</h2>
          <Markdown>{response}</Markdown>
          
          <button className="save-button" onClick={onSave} disabled={!response}>
            Save to MyAIO
          </button>

          {/* Display YouTube Video Links */}
          {youtubeLinks.length > 0 && (
            <div className="youtube-videos">
              <h3>Recommended YouTube Videos:</h3>
              {youtubeLinks.map((link, index) => {
                const videoId = link.split('v=')[1];
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
          )}
        </div>
      )}
    </div>
  );
};

// Main Component (Legal)
const Legal = () => {
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links
  const contentRef = useRef();

  const genAI = new GoogleGenerativeAI('AIzaSyDC22GRNHggs2RL1CXtPQwsCdxtUmBuIY8');

  const handleGenerateResponse = async () => {
    if (!situation) return;
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a quick guide for any law violation or government rule break for ${country}, in the ${language} language. The scenario is: ${situation}. Provide law mentioned in the ${country} law/rule book, charges/fines/actions, and personal advice.`; 
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      setResponse(generatedResponse);

      // Fetch YouTube links based on the situation
      fetchYoutubeVideos(situation);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch YouTube Videos
  const fetchYoutubeVideos = async (situation) => {
    const apiKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0'; // Replace with your actual API key
    const searchQuery = `${situation} legal advice ${language}`;
    const maxResults = 5;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=${maxResults}&key=${apiKey}`
      );
      const data = await response.json();
      const videoLinks = data.items.map(
        (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
      );
      setYoutubeLinks(videoLinks); // Store the video links in the state
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  const handleSave = async () => {
    const dataToSave = {
      country,
      state,
      language,
      situation,
      advice: response,
      youtubeLinks, // Store youtube links here as well
      timestamp: new Date().toISOString(),
    };

    try {
      await saveUserData(dataToSave); // Assuming this function saves data to Firebase
      alert('Legal advice saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save legal advice.');
    }
  };

  // Capture the content and download as image
  const handleDownloadAsImage = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'Legalhub.png';
        link.click();
      }).catch((error) => {
        console.error('Error capturing content as image:', error);
      });
    }
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <h1>
          <span style={{ fontWeight: 'bold', color: 'darkblue', fontSize: '36px' }} className="legal">
            Legal
          </span>
          <span style={{ fontStyle: 'bold', color: 'green', fontSize: '36px' }} className="advisor">
            Advisor
          </span>
        </h1>
      </div>
      <div className="content" ref={contentRef}> {/* Add ref here */}
        <Form
          country={country}
          state={state}
          situation={situation}
          language={language}
          onCountryChange={setCountry}
          onStateChange={setState}
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
          onDownloadAsImage={handleDownloadAsImage}
        />
      </div>
    </div>
  );
};

export default Legal;

