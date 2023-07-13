class DrumKit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      power: true,
      volume: 0.5,
      last: ""
    };
    // Instrument array for the drumkit. There was supposed to be a Heater 4 but the resource URL I got gave me a 404 error so I just repeated Heater 3 for the purposes of demonstration.
    this.instruments = [
      {
        key: "Q",
        name: "Heater 1",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
      },
      {
        key: "W",
        name: "Heater 2",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
      },
      {
        key: "E",
        name: "Heater 3",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
      },
      {
        key: "A",
        name: "Heater 3 again",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
      },
      {
        key: "S",
        name: "Clap",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
      },
      {
        key: "D",
        name: "Open-HH",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
      },
      {
        key: "Z",
        name: "Kick-n'-hat",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
      },
      {
        key: "X",
        name: "Kick",
        url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
      },
      {
        key: "C",
        name: "Closed-HH",
        url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
      }
    ];
  }

  // Listener for keypresses once the components have mounted.
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  // Makes sure the listener is cleaned up.
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  // When a keypress is detected, tries to find a drumpad with the matching key. If an instrument is found, proceeds to the handleClick function, passing the instrument.
  handleKeyDown = (event) => {
    const instrument = this.instruments.find(
      (pad) => pad.key === event.key.toUpperCase()
    );
    if (instrument) {
      this.handleClick(instrument);
    }
  };

  // If the power is on, creates a new audio object with the correct url for that instrument, then sets the volume to the slider value, then plays the audio.
  handleClick = (pad) => {
    if (this.state.power) {
      const audio = new Audio(pad.url);
      audio.volume = this.state.volume;
      audio.play();

      //Toggles active class for the buttons when they are pressed to create the inset effect, with each press lasting 200ms.
      const button = document.getElementById(pad.name);
      button.classList.add("active");
      button.classList.remove("inactive");
      setTimeout(() => {
        button.classList.add("inactive");
        button.classList.remove("active");
      }, 200);

      // Displays the name of the last played instrument.
      this.setState({ last: pad.name });
    }
  };

  // Flips the power and resets the last instrument display.
  handlePowerToggle = () => {
    this.setState((prevState) => ({ last: "", power: !prevState.power }));
  };

  handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    this.setState({ volume: newVolume });
  };

  render() {
    return (
      <div className="machine">
        <div className="pads">
          {this.instruments.map((pad) => (
            <button
              key={pad.key}
              onClick={() => this.handleClick(pad)}
              className="drum-pad inactive"
              id={pad.name}
            >
              {pad.key}
              <audio className="clip" id={pad.key} src={pad.url}>
                <a href={pad.url}>Didn't load -- download sound</a>
              </audio>
            </button>
          ))}
        </div>
        <div className="controls">
          <div className="control" id="display">
            {this.state.last}
          </div>
          <div className="control">
            <label htmlFor="power-control">Power</label>
            <input
              type="checkbox"
              id="power-control"
              checked={this.state.power}
              onChange={this.handlePowerToggle}
            />
          </div>
          <div className="control">
            <label htmlFor="volume-slider">Volume</label>
            <input
              type="range"
              id="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={this.state.volume}
              onChange={this.handleVolumeChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DrumKit />, document.getElementById("drum-machine"));
