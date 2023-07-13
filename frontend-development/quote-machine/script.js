class RandomQuoteMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [
        {
          quote:
            "With some exceptions, I like a lot of birds. But if I had to choose my favorite, I would pick the grey parrot.",
          author: "Alain Christe"
        },
        {
          quote:
            "The greatest glory in living lies not in never falling, but in rising every time we fall.",
          author: "Nelson Mandela"
        },
        {
          quote:
            "It is during our darkest moments that we must focus to see the light.",
          author: "Aristotle"
        },
        {
          quote:
            "Never let the fear of striking out keep you from playing the game.",
          author: "Babe Ruth"
        },
        {
          quote: "May you live all the days of your life.",
          author: "Jonathan Swift"
        },
        {
          quote: "No man who is in a hurry is quite civilized.",
          author: "Will Durant"
        },
        {
          quote:
            "In America, there are two classes of travel—first class and with children.",
          author: "Robert Benchley"
        },
        {
          quote:
            "I can accept failure; everyone fails at something. But I can't accept not trying.",
          author: "Michael Jordan"
        },
        {
          quote:
            "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.",
          author: "Jimmy Dean"
        },
        {
          quote:
            "Success is stumbling from failure to failure with no loss of enthusiasm.",
          author: "Winston Churchill"
        },
        {
          quote: "Morality is only moral when it is voluntary.",
          author: "Lincoln Steffens"
        },
        {
          quote:
            "You only have to do a very few things right in your life—so long as you don’t do too many things wrong.",
          author: "Warren Buffett"
        },
        {
          quote:
            "They always say time changes things, but you actually have to change them yourself.",
          author: "Andy Warhol"
        },
        {
          quote: "A problem is a chance for you to do your best.",
          author: "Duke Ellington"
        },
        {
          quote:
            "Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma – which is living with the results of other people’s thinking.",
          author: "Steve Jobs"
        },
        {
          quote:
            "The whole secret of a successful life is to find out what is one’s destiny to do, and then do it.",
          author: "Henry Ford"
        },
        {
          quote:
            "Life is never easy. There is work to be done and obligations to be met – obligations to truth, to justice, and to liberty.",
          author: "John F. Kennedy"
        },
        {
          quote:
            "Watch your thoughts; they become words. Watch your words; they become actions. Watch your actions; they become habits. Watch your habits; they become character. Watch your character; it becomes your destiny.",
          author: "Lao-Tze"
        }
      ],
      currentQuote: {
        quote: "",
        author: ""
      }
    };
  }

  componentDidMount() {
    this.getRandomQuote();
  }

  getRandomQuote = () => {
    const index = Math.floor(Math.random() * this.state.quotes.length);
    const newQuote = this.state.quotes[index];
    const quoteBox = document.getElementById("quote-box");
    const newColor = () => {
      let color = "#";
      for (let i = 0; i < 3; i++) {
        color += Math.floor(Math.random() * 8);
      }
      return color;
    };

    document.documentElement.style.setProperty("--bg-color", newColor());
    quoteBox.style.color = "#fff";

    setTimeout(() => {
      this.setState({
        currentQuote: newQuote
      });

      quoteBox.style.color = "var(--bg-color)";
    }, 500);
  };

  render() {
    return (
      <div id="quote-box">
        <div id="text">
          <i class="fa fa-quote-left" id="quote-mark"></i>
          {this.state.currentQuote.quote}
        </div>
        <div id="author">- {this.state.currentQuote.author}</div>
        <div id="bottom">
          <button
            class="button"
            id="new-quote"
            type="button"
            onClick={this.getRandomQuote}
          >
            New quote
          </button>
          <a class="button" id="tweet-quote" href="twitter.com/intent/tweet">
            <i class="fa-brands fa-twitter"></i>
          </a>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<RandomQuoteMachine />, document.getElementById("root"));
