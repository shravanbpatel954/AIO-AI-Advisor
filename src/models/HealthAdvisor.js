import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './HealthAdvisor.css';
import Markdown from 'react-markdown';
import { saveUserData } from '../components/firebase'; // Assuming saveUserData is a function to save data to Firebase
import html2canvas from 'html2canvas';
import YouTube from 'react-youtube'; // Import YouTube player library

// Form Component
const Form = ({ healthCondition, healthConcerns, language, onHealthConditionChange, onHealthConcernsChange, onLanguageChange, onGenerateResponse, isLoading }) => {
  return (
    <div className="form-container">
      <div className="input-section">
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
        <label>Select Type of Health Condition:</label>
        <select value={healthCondition} onChange={(e) => onHealthConditionChange(e.target.value)}>
          <option value="Mental">Mental</option>
          <option value="Physical">Physical</option>
          <option value="Emotional">Emotional</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <label>Describe Your Health Concern:</label>
        <textarea
          rows="4" 
          cols="50" 
          placeholder="Provide details about your health condition..." 
          value={healthConcerns} 
          onChange={(e) => onHealthConcernsChange(e.target.value)} 
        ></textarea>
        <br />
        <button onClick={onGenerateResponse} disabled={isLoading || !healthConcerns}>Generate Health Advice</button>
      </div>
    </div>
  );
};

// Response Component
const Response = ({ response, isLoading, youtubeLinks, onSave, onDownloadAsImage }) => {
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
          <span>Generating your health advice...</span>
        </div>
      ) : (
        <div id="response-container">
          <h2>Health Advisor says:</h2>
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
          <button className="save-button" onClick={onSave} disabled={!response}>
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
    Designed and Developed by <strong>Shravankumar</strong>
  </div>
);

// Main Component
const Health = () => {
  const [healthConcerns, setHealthConcerns] = useState('');
  const [healthCondition, setHealthCondition] = useState('Mental');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links
  const contentRef = useRef(); // Reference for the content to capture

  const genAI = new GoogleGenerativeAI('AIzaSyDC22GRNHggs2RL1CXtPQwsCdxtUmBuIY8');

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a health advisor. The health concern is: ${healthConcerns}. The condition is: ${healthCondition}. Provide advice in ${language}.`;
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      setResponse(generatedResponse);

      // Fetch YouTube links based on the health concern
      await fetchYoutubeVideos(healthConcerns, language);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch YouTube Videos
  const fetchYoutubeVideos = async (healthConcerns, language) => {
    const apiKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0'; // Replace with your YouTube API Key
    const searchQuery = `${healthConcerns} health advice ${language}`;
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

  const handleSave = async () => {
    const dataToSave = {
      healthCondition,
      healthConcerns,
      language,
      advice: response,
      youtubeLinks,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveUserData(dataToSave); // Assuming this function saves data to Firebase
      alert('Health advice and videos saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save health advice.');
    }
  };

  // Capture the content and download as image
  const handleDownloadAsImage = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'HealthAdvisor.png';
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
          <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '36px' }} className="health">Health-</span>
          <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '36px' }} className="advisor">Advisor</span>
        </h1>
      </div>
      <div className="content" ref={contentRef}> {/* Add ref here */}
        <Form
          healthCondition={healthCondition}
          healthConcerns={healthConcerns}
          language={language}
          onHealthConditionChange={setHealthCondition}
          onHealthConcernsChange={setHealthConcerns}
          onLanguageChange={setLanguage}
          onGenerateResponse={handleGenerateResponse}
          isLoading={isLoading}
        />
        <Response
          response={response}
          isLoading={isLoading}
          youtubeLinks={youtubeLinks}
          onDownloadAsImage={handleDownloadAsImage}
          onSave={handleSave}
        />
      </div>
      <MadeBy />
    </div>
  );
};

export default Health;
