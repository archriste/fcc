class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputString: "\u00A0",
      currentTerm: "0"
    };
    this.buttons = [
      { id: "equals", symbol: "=" },
      { id: "zero", symbol: "0" },
      { id: "one", symbol: "1" },
      { id: "two", symbol: "2" },
      { id: "three", symbol: "3" },
      { id: "four", symbol: "4" },
      { id: "five", symbol: "5" },
      { id: "six", symbol: "6" },
      { id: "seven", symbol: "7" },
      { id: "eight", symbol: "8" },
      { id: "nine", symbol: "9" },
      { id: "add", symbol: "+" },
      { id: "subtract", symbol: "-" },
      { id: "multiply", symbol: "*" },
      { id: "divide", symbol: "/" },
      { id: "decimal", symbol: "." },
      { id: "clear", symbol: "AC" }
    ];
    this.numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    this.operators = ["=", "+", "-", "*", "/", "AC"];
    this.snipRegex = /^.*\d/;
  }

  calculate = () => {
    const expression = this.state.inputString.match(this.snipRegex)[0];
    return eval(expression) + "";
  };

  handleClick = (id, symbol) => {
    console.log(id + " " + symbol);
    const pressedButton = this.buttons.find((b) => b.id === id);

    if (!pressedButton) {
      return;
    }

    if (this.numbers.includes(symbol)) {
      this.handleNumber(symbol);
    } else if (this.operators.includes(symbol)) {
      this.handleOperator(symbol);
    }

    const activeButton = document.getElementById(id);
    activeButton.classList.add("active");
    activeButton.classList.remove("inactive");
    setTimeout(() => {
      activeButton.classList.remove("active");
      activeButton.classList.add("inactive");
    }, 100);
  };

  handleNumber = (num) => {
    if (
      (num === "0" &&
        ((this.state.inputString.endsWith("0") &&
          this.state.currentTerm.startsWith("0") &&
          !this.state.currentTerm.includes(".")) ||
          (!this.state.currentTerm.includes(".") &&
            this.state.currentTerm.startsWith("0")))) ||
      (num === "." && this.state.currentTerm.includes("."))
    ) {
      return;
    } else if (num === "." && this.state.inputString.includes("=")) {
      this.setState({
        inputString: this.state.currentTerm + ".",
        currentTerm: this.state.currentTerm + "."
      });
    } else if (
      num === "." &&
      (this.state.inputString === "0" || this.state.inputString === "\u00A0")
    ) {
      this.setState({
        inputString: "0.",
        currentTerm: "0."
      });
    } else if (num === "." && this.state.currentTerm.endsWith("0")) {
      this.setState({
        inputString: this.state.inputString + ".",
        currentTerm: this.state.currentTerm + "."
      });
    } else if (num === "." && this.operators.includes(this.state.currentTerm)) {
      this.setState({
        inputString: this.state.inputString + "0.",
        currentTerm: "0."
      });
    } else if (this.operators.includes(this.state.currentTerm)) {
      this.setState({
        inputString: this.state.inputString + num,
        currentTerm: num
      });
    } else if (
      this.state.currentTerm.startsWith("0") &&
      num !== "." &&
      num !== "0" &&
      !this.state.currentTerm.includes(".")
    ) {
      this.setState({
        inputString:
          this.state.inputString.substring(
            0,
            this.state.inputString.length - 1
          ) + num,
        currentTerm: num
      });
    } else if (
      this.state.inputString === "0" ||
      this.state.inputString === "\u00A0" ||
      this.state.inputString.includes("=")
    ) {
      this.setState({
        inputString: num,
        currentTerm: num
      });
    } else {
      this.setState({
        inputString: this.state.inputString + num,
        currentTerm: this.state.currentTerm + num
      });
    }
  };

  handleOperator = (op) => {
    if (op === "AC") {
      this.setState({
        inputString: "\u00A0",
        currentTerm: "0"
      });
    } else if (
      op === "=" &&
      !this.state.inputString.includes("=") &&
      !this.state.inputString.includes("\u00A0") && (this.state.inputString !== "-")
    ) {
      this.setState({
        inputString: this.state.inputString.match(this.snipRegex)[0] + "=",
        currentTerm: this.calculate() + ""
      });
    } else if (op !== "=" && this.state.inputString.includes("=")) {
      this.setState({
        inputString: this.state.currentTerm + op,
        currentTerm: op
      });
    } else if (op === "-" && this.state.inputString.includes("\u00A0")) {
      this.setState({
        inputString: "-0",
        currentTerm: "0"
      });
    } else if (
      (op === "-" &&
        !this.state.inputString.endsWith("-") &&
        !this.state.inputString.endsWith(".") &&
        !this.state.inputString.endsWith("\u0A00")) ||
      (op !== "=" &&
        this.numbers.includes(this.state.inputString.at(-1)) &&
        !this.state.inputString.endsWith("."))
    ) {
      this.setState({
        inputString: this.state.inputString + op,
        currentTerm: op
      });
    } else if (this.state.inputString.endsWith(".")) {
      this.setState({
        inputString:
          this.state.inputString.substring(
            0,
            this.state.inputString.length - 1
          ) + op,
        currentTerm: op
      });
    }
  };

  render() {
    return (
      <div className="calc">
        <div className="calc-display" id="display">
          <div className="outputs input-string">{this.state.inputString}</div>
          <div className="outputs current-term">{this.state.currentTerm}</div>
        </div>
        <div className="button-grid">
          {this.buttons.map((button) => (
            <button
              id={button.id}
              className="inactive"
              onClick={() => this.handleClick(button.id, button.symbol)}
            >
              {button.symbol}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
