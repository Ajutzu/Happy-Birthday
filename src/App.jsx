import React, { useState, useRef, useEffect } from "react";
import happyBirthday from "./music/happy-birthday.mp3";
import employeeData from "./data/employees.json";

function App() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef(null);
  const microphoneRef = useRef(null);

  // Function to handle microphone setup and blow detection
  const startListeningForBlow = () => {
    setIsListening(true);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        microphoneRef.current = stream;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;

          // Blow detection - adjust sensitivity as needed
          if (average > 35) {
            // Threshold for detecting a blow
            handleBlow();
            stopListening();
          }
        };
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setIsListening(false);
      });
  };

  const stopListening = () => {
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach((track) => track.stop());
      microphoneRef.current = null;
    }
    setIsListening(false);
  };

  const handleBlow = () => {
    setIsBookOpen(true);
    audioRef.current
      .play()
      .catch((error) => console.error("Playback failed:", error));
  };

  const handleClose = () => {
    setIsBookOpen(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Clean up microphone when component unmounts
  useEffect(() => {
    return () => {
      if (microphoneRef.current) {
        microphoneRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="container">
      <div className={`book ${isBookOpen ? "open" : ""}`}>
        <div className="book-cover">
          {!isBookOpen && (
            <div className="candle-container">
              <div className="candle">
                <div
                  className={`flame ${isListening ? "listening" : ""}`}
                ></div>
                <div className="wax"></div>
              </div>
              <h2 className="gradient-title text-center">
                Birthday Messages from
                <br /> Tech Executive Labs
              </h2>
              {!isListening ? (
                <button onClick={startListeningForBlow} className="start-btn">
                  Start
                </button>
              ) : (
                <div className="listening-text">
                  Blow to extinguish the flame!
                </div>
              )}
              <p>By: Tech Dev Department</p>
            </div>
          )}
        </div>

        <div className="book-page left-page">
          <h2 className="main-title">Birthday Messages</h2>
          <div className="message-list">
            {employeeData.map((person, index) => (
              <div key={index} className="message-item">
                <div className="message-header">
                  <img
                    src={person.profile}
                    alt={person.name}
                    className="profile-pic"
                  />
                  <span className="sender-name">{person.name}</span>
                </div>
                <p className="message-text">{person.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="book-page right-page">
          <div className="birthday-person-container">
            <img
              src="images/jazzon.png"
              alt="Birthday Person"
              className="birthday-person-image"
            />
            <h2 className="main-title"> Happy
              Birthday!
            </h2>
            <div className="birthday-message">
              <p style={{fontSize: "15px"}}>
                On this special day, we celebrate not just your birth but also
                your exceptional leadership, vision, and dedication. Your
                unwavering commitment and inspiring guidance continue to drive
                our team towards success. May this year bring you even greater
                achievements, happiness, and fulfillment. Wishing you good
                health, prosperity, and many joyful moments. Enjoy your day to
                the fullest!{" "}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="close-btn">
            Close Notes
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={happyBirthday} loop />
    </div>
  );
}

export default App;
