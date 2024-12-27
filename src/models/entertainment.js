import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './entertainment.css';
import Markdown from 'react-markdown';
import { saveUserData } from '../components/firebase'; // Assuming saveUserData is a function to save data to Firebase
import YouTube from 'react-youtube'; // Import YouTube player library
import html2canvas from 'html2canvas';

// Form Component
const Form = ({
  genre,
  preferences,
  language,
  ageGroup,
  onGenreChange,
  onPreferencesChange,
  onLanguageChange,
  onAgeGroupChange,
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

  return (
    <div className="form-container">
      <div className="input-section">
        <label>Select Genre:</label>
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          style={inputStyle}
        >
          <option value="Movies">Movies</option>
          <option value="Music">Music</option>
          <option value="Books">Books</option>
          <option value="Games">Games</option>
        </select>
        <br />
        <label>Select Language:</label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          style={inputStyle}
        >
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
        <label>Age Group:</label>
        <select
          value={ageGroup}
          onChange={(e) => onAgeGroupChange(e.target.value)}
          style={inputStyle}
        >
          <option value="Kids">Kids</option>
          <option value="Teens">Teens</option>
          <option value="Adults">Adults</option>
          <option value="Seniors">Seniors</option>
        </select>
        <br />
        <label>Preferences (e.g., comedy, thriller, adventure):</label>
        <input
          type="text"
          value={preferences}
          onChange={(e) => onPreferencesChange(e.target.value)}
          style={inputStyle}
        />
        <br />
        <button onClick={onGenerateResponse} disabled={isLoading || !genre || !preferences}>
          Generate Recommendations
        </button>
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
          <span>Generating your recommendations...</span>
        </div>
      ) : (
        <div id="response-container">
          <h2>Entertainment Advisor recommends:</h2>
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
    Designed and Developed by <strong>Shravankumar</strong>
  </div>
);

// Main Component
const Entertainment = () => {
  const [genre, setGenre] = useState('Movies');
  const [preferences, setPreferences] = useState('');
  const [language, setLanguage] = useState('en');
  const [ageGroup, setAgeGroup] = useState('Adults');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links

  const genAI = new GoogleGenerativeAI('AIzaSyDC22GRNHggs2RL1CXtPQwsCdxtUmBuIY8');

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);
      const prompt = `You are an entertainment advisor. Recommend ${genre} in ${language} language for ${ageGroup}. User preferences are: ${preferences}. Provide detailed suggestions.`;
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      setResponse(generatedResponse);

      // Fetch YouTube links based on the preferences
      await fetchYoutubeVideos(preferences, language);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch YouTube Videos
  const fetchYoutubeVideos = async (preferences, language) => {
    const apiKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0'; // Replace with your YouTube API Key
    const searchQuery = `${preferences} ${genre} recommendations ${language}`;
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
      genre,
      preferences,
      language,
      ageGroup,
      recommendations: response,
      youtubeLinks,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveUserData(dataToSave); // Assuming this function saves data to Firebase
      alert('Recommendations saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save recommendations.');
    }
  };

  const handleDownloadAsImage = () => {
    const responseElement = document.getElementById('response-container');
    if (responseElement) {
      html2canvas(responseElement).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'EntertainmentAdvisor.png';
        link.click();
      });
    }
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <h1>
          <span style={{ fontWeight: 'bold', color: '#dc3545', fontSize: '36px' }} className="entertainment">
            Entertainment-
          </span>
          <span style={{ fontWeight: 'bold', color: '#ffc107', fontSize: '36px' }} className="advisor">
            Advisor
          </span>
        </h1>
      </div>
      <div className="content">
        <Form
          genre={genre}
          preferences={preferences}
          language={language}
          ageGroup={ageGroup}
          onGenreChange={setGenre}
          onPreferencesChange={setPreferences}
          onLanguageChange={setLanguage}
          onAgeGroupChange={setAgeGroup}
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
      <MadeBy />
    </div>
  );
};

export default Entertainment;
