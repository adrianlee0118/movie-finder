import React, { useState } from "react";
import axios from "axios";
import "./App.css";

/*
Basic pattern
https://tastedive.com/api/similar?{query}={value}&k=YOUR API-KEY

Verbose Basic pattern
https://tastedive.com/api/similar?{query}={value}&k=YOUR API-KEY&info=1

Example query
https://tastedive.com/api/similar?info=1&q=Thor: Ragnarok&k=YOUR API-KEY

Multiple parameters basic pattern
https://tastedive.com/api/similar?{param1}&{param2}&{param3}

Example query - information about the movie and the similiar one.
https://tastedive.com/api/similar?limit=1&q=Guardians Of The Galaxy Vol. 2

For more than one parameter values
https://tastedive.com/api/similar?limit=1&q=Thor: Ragnarok&k=YOUR API-KEY

Parameters:
query= (q=)  {string title} Required
type= {music, movies, shows, podcasts, books, authors, games} Optional
info= {0,1 to toggle verbose mode} Optional
limit= {integer for maximum number of results} Optional
k= {API Key} Required
*/

const PATH_BASE = "https://tastedive.com/api/similar";
const PARAM_QUERY = "q=";
const PARAM_TYPE = "type=";
const PARAM_INFO = "info=";
const PARAM_LIMIT = "limit=";
const PARAM_KEY = "k=";

const DEFAULT_QUERY = "Thor: Ragnarok";
const YOUTUBE_PREFIX = "https://www.youtube.com/watch?v=";
const API_KEY = "12345678";

const hits = {
  Similar: {
    Info: [{ Name: "Guardians Of The Galaxy Vol. 2", Type: "movie" }],
    Results: [
      { Name: "Thor: Ragnarok", Type: "movie" },
      { Name: "Star Wars: The Last Jedi", Type: "movie" },
      { Name: "Spider-Man: Homecoming", Type: "movie" },
      { Name: "Avengers: Infinity War", Type: "movie" },
      { Name: "Power Rangers", Type: "movie" },
      { Name: "Deadpool 2", Type: "movie" },
      { Name: "Black Panther", Type: "movie" },
      { Name: "Jumanji: Welcome To The Jungle", Type: "movie" },
      { Name: "Bright", Type: "movie" },
      {
        Name: "Pirates Of The Caribbean: Dead Men Tell No Tales",
        Type: "movie",
      },
      { Name: "The Hitman's Bodyguard", Type: "movie" },
      { Name: "Ready Player One", Type: "movie" },
      { Name: "Kingsman: The Golden Circle", Type: "movie" },
      { Name: "Baywatch", Type: "movie" },
      { Name: "The Fate Of The Furious", Type: "movie" },
      { Name: "The Divergent Series: Insurgent", Type: "movie" },
      { Name: "Independence Day: Resurgence", Type: "movie" },
      { Name: "Captain Marvel", Type: "movie" },
      { Name: "Assassin's Creed", Type: "movie" },
      { Name: "Ant-Man And The Wasp", Type: "movie" },
    ],
  },
};

const verbose_data = {
  Similar: {
    Info: [
      {
        Name: "Thor: Ragnarok",
        Type: "movie",
        wTeaser:
          "\n\n\nThor: Ragnarok is a 2017 American superhero film based on the Marvel Comics character Thor, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. It is the sequel to 2011's Thor and 2013's Thor: The Dark World, and the seventeenth film in the Marvel Cinematic Universe (MCU). The film is directed by Taika Waititi from a screenplay by Eric Pearson and the writing team of Craig Kyle and Christopher Yost, and stars Chris Hemsworth as Thor alongside Tom Hiddleston, Cate Blanchett, Idris Elba, Jeff Goldblum, Tessa Thompson, Karl Urban, Mark Ruffalo, and Anthony Hopkins. In Thor: Ragnarok, Thor must escape the alien planet Sakaar in time to save Asgard from Hela and the impending Ragnarök.\n",
        wUrl: "https://en.wikipedia.org/wiki/Thor:_Ragnarok",
        yUrl: "https://www.youtube-nocookie.com/embed/ue80QwXMRHg",
        yID: "ue80QwXMRHg",
      },
    ],
    Results: [
      {
        Name: "Avengers: Infinity War",
        Type: "movie",
        wTeaser:
          "\n\n\n\nAvengers: Infinity War is a 2018 American superhero film based on the Marvel Comics superhero team the Avengers, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. It is the sequel to 2012's The Avengers and 2015's Avengers: Age of Ultron, and the nineteenth film in the Marvel Cinematic Universe (MCU). It was directed by Anthony and Joe Russo, written by Christopher Markus and Stephen McFeely, and features an ensemble cast including Robert Downey Jr., Chris Hemsworth, Mark Ruffalo, Chris Evans, Scarlett Johansson, Benedict Cumberbatch, Don Cheadle, Tom Holland, Chadwick Boseman, Paul Bettany, Elizabeth Olsen, Anthony Mackie, Sebastian Stan, Danai Gurira, Letitia Wright, Dave Bautista, Zoe Saldana, Josh Brolin, and Chris Pratt. In the film, the Avengers and the Guardians of the Galaxy attempt to stop Thanos from collecting the all-powerful Infinity Stones.\n",
        wUrl: "https://en.wikipedia.org/wiki/Avengers:_Infinity_War",
        yUrl: "https://www.youtube-nocookie.com/embed/QwievZ1Tx-8",
        yID: "QwievZ1Tx-8",
      },
    ],
  },
};

const MovieFinderClient = () => {
  const [data, setData] = useState(hits.Similar.Results);
  const [searchTerm, setSearchTerm] = useState("");
  const onSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const onDismiss = (target) => {
    const updatedData = data.filter((item) => item.Name !== target);
    setData(updatedData);
  };
  return (
    <div className="page">
      <div className="interactions">
        <Search value={searchTerm} onChange={onSearchChange}>
          Search
        </Search>
      </div>
      <Table data={data} pattern={searchTerm} onDismiss={onDismiss} />
    </div>
  );
};

const Search = ({ value, onChange, children }) => (
  <form>
    {children} <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = ({ data, pattern, onDismiss }) => (
  <div className="table">
    {data
      .filter((item) => item.Name.toLowerCase().includes(pattern.toLowerCase()))
      .map((item) => (
        <div key={item.Name} className="table-row">
          <span style={{ width: "50%" }}>{item.Name}</span>
          <span style={{ width: "50%" }}>
            <Button onClick={() => onDismiss(item.Name)}>Dismiss</Button>
          </span>
        </div>
      ))}
  </div>
);

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

const App = () => <MovieFinderClient />;

export default App;
