import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './TechAdvisor.css';
import Markdown from 'react-markdown';
import { saveUserData } from '../components/firebase'; // Assuming saveUserData is a function to save data to Firebase
import YouTube from 'react-youtube'; // Import YouTube player library

// Form Component
const Form = ({ techIssue, query, language, onTechIssueChange, onQueryChange, onLanguageChange, onGenerateResponse, isLoading }) => {
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
        <label>Select Type of Tech Issue:</label>
        <select value={techIssue} onChange={(e) => onTechIssueChange(e.target.value)}>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Coding">Coding</option>
          <option value="Networking">Networking</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <label>Describe Your Tech Issue:</label>
        <textarea
          rows="4"
          cols="50"
          placeholder="Provide details about your tech issue..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        ></textarea>
        <br />
        <button onClick={onGenerateResponse} disabled={isLoading || !query}>Generate Tech Advice</button>
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
          <span>Generating your tech advice...</span>
        </div>
      ) : (
        <div id="response-container">
          <h2>Tech Advisor says:</h2>
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
          <button
            className="save-button"
            onClick={onSave}
            disabled={!response || youtubeLinks.length === 0}
          >
            Save to Database
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

// Main Component
const TechAdvisor = () => {
  const [query, setQuery] = useState('');
  const [techIssue, setTechIssue] = useState('Hardware');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links

  const genAI = new GoogleGenerativeAI('AIzaSyDC22GRNHggs2RL1CXtPQwsCdxtUmBuIY8'); // Replace with your actual API key

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a tech advisor. The issue is: ${query}. Provide advice for resolving a ${techIssue} issue in ${language}.`;
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      setResponse(generatedResponse);

      // Fetch YouTube links based on the tech issue
      await fetchYoutubeVideos(query, language);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch YouTube Videos based on the query and language
  const fetchYoutubeVideos = async (query, language) => {
    const apiKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0'; // Replace with your YouTube API Key
    const searchQuery = `${query} ${techIssue} tutorial ${language}`;
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
      techIssue,
      language,
      query,
      advice: response,
      youtubeLinks,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveUserData(dataToSave); // Assuming this function saves data to Firebase
      alert('Tech advice and videos saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save tech advice.');
    }
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <h1>
          <span
            style={{
              fontWeight: 'bold',
              color: '#007bff', // Blue for 'Tech'
              fontSize: '36px',
            }}
            className="tech"
          >
            Tech-
          </span>
          <span
            style={{
              fontWeight: 'bold',
              color: '#ff9800', // Orange for 'Advisor' to indicate expertise and guidance
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
          techIssue={techIssue}
          query={query}
          language={language}
          onTechIssueChange={setTechIssue}
          onQueryChange={setQuery}
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

export default TechAdvisor;
