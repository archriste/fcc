// I made sure to use functional components for this implementation of React. Also, I decided to use number inputs for the length controls for ease of use and demonstrating event value extraction.

// Defines the use hooks.
const { useState, useRef, useEffect } = React;

// Main functional component
function Timer() {
  // Set state for each of the state variables needed for the clock
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState("Session");
  const [time, setTime] = useState(1500);
  const [sessionTime, setSessionTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  // Initialize an empty audioRef which will be used for the beep.
  const audioRef = useRef(null);

  // Resets values to defaults, stops audio playback by pausing, and returns the playback to the beginning.
  const handleReset = () => {
    setActive(false);
    setMode("Session");
    setTime(1500);
    setSessionTime(25);
    setBreakTime(5);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Inverts the active boolean.
  const handleStartStop = () => {
    setActive((prevActive) => !prevActive);
  };

  // The following 2 handlers take the input values for the desired session/break length and update the state accordingly.
  const handleSessionTimeChange = (event) => {
    newTime = event.target.value;
    setSessionTime(newTime);
    setTime(newTime * 60);
  };

  const handleBreakTimeChange = (event) => {
    newTime = event.target.value;
    setBreakTime(newTime);
  };

  // Takes the main time variable and formats it for display by adding a leading zero when needed.
  const formatTime = (seconds) => {
    const displayedMinutes = Math.floor(seconds / 60);
    const displayedSeconds = seconds % 60;
    return `${displayedMinutes < 10 ? "0" : ""}${displayedMinutes} : ${
      displayedSeconds < 10 ? "0" : ""
    }${displayedSeconds}`;
  };

  // Decrements the main time variable by 1 every 1000ms, then beeps and flips the mode when the timer reaches zero.
  const clockDown = () => {
    let timerInterval = null;
    if (active && time > 0) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setMode((prevMode) => (prevMode === "Session" ? "Break" : "Session"));
      setTime(mode === "Session" ? breakTime * 60 : sessionTime * 60);
      audioRef.current.play();
    }
    return () => clearInterval(timerInterval);
  };

  // Makes sure the interval function is cleaned up and instructs the program to associate the state variables with the useEffect hook.
  useEffect(() => {
    const cleanupFunction = clockDown();
    return cleanupFunction;
  }, [active, time, mode, breakTime, sessionTime]);

  return (
    <div id="timer-main">
      <div id="title">Productivity Clock</div>
      <TimerSetting
        sessionTime={sessionTime}
        breakTime={breakTime}
        onSessionTimeChange={handleSessionTimeChange}
        onBreakTimeChange={handleBreakTimeChange}
      />
      <TimerDisplay time={time} mode={mode} formatTime={formatTime} />
      <TimerControl onStartStop={handleStartStop} onReset={handleReset} />
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

// Settings component for session and break lengths
function TimerSetting({
  sessionTime,
  breakTime,
  onSessionTimeChange,
  onBreakTimeChange
}) {
  return (
    <div id="settings">
      <label for="break-length">Break Length (min)</label>
      <input
        id="break-length"
        value={breakTime}
        type="number"
        min="1"
        max="60"
        onChange={(e) => onBreakTimeChange(e)}
      />
      <label for="session-length">Session Length (min)</label>
      <input
        id="session-length"
        value={sessionTime}
        type="number"
        min="1"
        max="60"
        onChange={(e) => onSessionTimeChange(e)}
      />
    </div>
  );
}

// Display component for showing the time and current timer mode
function TimerDisplay({ time, mode, formatTime }) {
  return (
    <div id="display">
      <h3 id="timer-label">{mode}</h3>
      <h2>{formatTime(time)}</h2>
    </div>
  );
}

// Control component for the start/stop toggle and reset button.
function TimerControl({ onStartStop, onReset }) {
  return (
    <div id="controls">
      <button id="start_stop" onClick={onStartStop}>
        <i class="fa-solid fa-play"></i> <i class="fa-solid fa-pause"></i>
      </button>
      <button id="reset" onClick={onReset}>
        <i class="fa-solid fa-rotate"></i>
      </button>
    </div>
  );
}

ReactDOM.render(<Timer />, document.getElementById("root"));
