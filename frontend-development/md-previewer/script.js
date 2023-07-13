// The default text to be displayed in the editor window when the editor is mounted.
const defaultText =
  "# Welcome to my React markdown previewer.\n\n## Try it out yourself!\n\n[Here's my website!](https://christe.co)\n\n`You can try lots of different formatting.`\n\n1.Feel free to send any suggestions.\n\n>Now here's a nice picture.\n\n![scenery](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Spiti_River_Kaza_Himachal_Jun18_D72_7232.jpg/320px-Spiti_River_Kaza_Himachal_Jun18_D72_7232.jpg)\n\n**I'm always looking for input!**\n\n```\n<code>Don't be afraid to reach out!</code>\n```\n\n- Alain";

// Component for rendering the textarea with default value and binding the onChange function.
const InputArea = ({ onChange }) => {
  return (
    <textarea id="editor" onChange={onChange} defaultValue={defaultText} />
  );
};

// The editor component for the entire editor window.
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { maximized: false };
    this.toggleMaximize = this.toggleMaximize.bind(this);
  }

  // When maximize is toggled, flips the maximized state boolean and hides the preview window by adding the hidden class.
  toggleMaximize() {
    this.setState((prevState) => ({ maximized: !prevState.maximized }));
    const previewWindow = document.querySelector(".preview-window");
    previewWindow.classList.toggle("hidden");
  }

  render() {
    //Takes the onChange and maximized value from the parent and destructures them to be used in this component.
    const { onChange } = this.props;
    const { maximized } = this.state;
    return (
      // If the window is maximized, adds the maximized class to the div. Adds no extra class otherwise.
      <div className={`editor-window${maximized ? " maximized" : ""}`}>
        <div className="toolbar">
          <button onClick={this.toggleMaximize}>
            Editor
            <i class="fa-solid fa-sort"></i>
          </button>
        </div>
        <InputArea onChange={onChange} />
      </div>
    );
  }
}

// Component for the preview window content
const PreviewOutput = ({ input }) => {
  return (
    // Using marked to process markdown; passes input string to marked.parse() and sets dangerouslySetInnerHTML equal to the result. It's possible the user could add some problematic input but there's no need to sanitize it right now.
    <div
      id="preview"
      dangerouslySetInnerHTML={{ __html: marked.parse(input) }}
    />
  );
};

// The component for the entire previewer window.
class Previewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { maximized: false };
    // Binds the toggleMaximize function to the Previewer window. 
    this.toggleMaximize = this.toggleMaximize.bind(this);
  }

  toggleMaximize() {
    this.setState((prevState) => ({ maximized: !prevState.maximized }));
    const editorWindow = document.querySelector(".editor-window");
    editorWindow.classList.toggle("hidden");
  }

  render() {
    const { input } = this.props;
    const { maximized } = this.state;
    return (
      <div className={`preview-window${maximized ? " maximized" : ""}`}>
        <div className="toolbar">
          <button onClick={this.toggleMaximize}>
            Previewer
            <i class="fa-solid fa-sort"></i>
          </button>
        </div>
        <PreviewOutput input={input} />
      </div>
    );
  }
}

// The parent component
class MarkdownApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: defaultText };
    this.onChange = this.onChange.bind(this);
  }

  // Sets the input state variable to the current value of the editor textarea.
  onChange(event) {
    this.setState({ input: event.target.value });
  }

  render() {
    const { input } = this.state;
    return (
      <div className="wrapper">
        <Editor onChange={this.onChange} />
        <Previewer input={input} />
      </div>
    );
  }
}

ReactDOM.render(<MarkdownApp />, document.getElementById("root"));
