import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { sortBy } from "lodash";
import classNames from "classnames";
import "./App.scss";

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
const PARAM_KEY = "k=381161-Squirloc-344JJHC8";

const DEFAULT_QUERY = "Thor: Ragnarok";
const YOUTUBE_PREFIX = "https://www.youtube.com/watch?v=";
const proxyurl = "https://cors-anywhere.herokuapp.com/";

/*
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

******SLIDER FORMAT
const movies = [
  {
    id: 1,
    image: '/images/slide1.jpg',
    imageBg: '/images/slide1b.webp',
    title: '1983'
  },
  {
    id: 2,
    image: '/images/slide2.jpg',
    imageBg: '/images/slide2b.webp',
    title: 'Russian doll'
  },
  {
    id: 3,
    image: '/images/slide3.jpg',
    imageBg: '/images/slide3b.webp',
    title: 'The rain',
  },
  {
    id: 4,
    image: '/images/slide4.jpg',
    imageBg: '/images/slide4b.webp',
    title: 'Sex education'
  },
  {
    id: 5,
    image: '/images/slide5.jpg',
    imageBg: '/images/slide5b.webp',
    title: 'Elite'
  },
  {
    id: 6,
    image: '/images/slide6.jpg',
    imageBg: '/images/slide6b.webp',
    title: 'Black mirror'
  }
];

  <Slider>
    {movies.map(movie => (
      <Slider.Item movie={movie} key={movie.id}>item1</Slider.Item>
    ))}
  </Slider>
*/

//Add sort by date, director name as well
const SORTS = {
  NONE: (list) => list,
  NAME: (list) => sortBy(list, "Name"),
  TYPE: (list) => sortBy(list, "Type"),
};

const MovieFinderClient = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(DEFAULT_QUERY);
  const [searchKey, setSearchKey] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState("NONE");
  const [isSortReverse, setIsSortReverse] = useState(false);

  const needsToSearchTopStories = (searchTerm) => {
    return !data[searchTerm];
  };

  const setSearchMovies = (newdata) => {
    setData({ ...data, [searchKey]: newdata });
    setIsLoading(false);
  };

  const fetchMovies = async (searchTerm) => {
    setIsLoading(true);
    try {
      const result = await axios(
        `${proxyurl}${PATH_BASE}?${PARAM_QUERY}${searchTerm}&${PARAM_KEY}`
      );
      setSearchMovies(result.data.Similar.Results);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    setSearchKey(searchTerm);
    if (needsToSearchTopStories(searchTerm)) {
      fetchMovies(searchTerm);
    }
  }, [searchKey]);

  const onSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const onDismiss = (target) => {
    const updatedData = data[searchKey].filter((item) => item.Name !== target);
    setData({ ...data, [searchKey]: updatedData });
  };

  const onSearchSubmit = (event) => {
    setSearchKey(searchTerm);
    if (needsToSearchTopStories(searchTerm)) {
      fetchMovies(searchTerm);
    }
    event.preventDefault();
  };

  const onSort = (key) => {
    const reverse = sortKey === key && !isSortReverse;
    setIsSortReverse(reverse);
    setSortKey(key);
  };

  return (
    <div className="page">
      <div className="interactions">
        <Search
          value={searchTerm}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        >
          Search
        </Search>
      </div>
      {error ? (
        <div className="interactions">Something went wrong.</div>
      ) : (
        <Table
          data={(data && data[searchKey]) || []}
          onDismiss={onDismiss}
          sortKey={sortKey}
          onSort={onSort}
          isSortReverse={isSortReverse}
        />
      )}
      <div className="interactions">
        {isLoading ? <Loading /> : <div></div>}
        {!isLoading && data[searchKey] && data[searchKey].length === 0 ? (
          <div>No results found.</div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const Search = ({ value, onChange, onSubmit, children }) => {
  let input;
  useEffect(() => {
    if (input) input.focus();
  }, [input]);
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={(el) => (input = el)}
      />
      <button type="submit">{children}</button>
    </form>
  );
};

const Table = ({ data, onDismiss, sortKey, onSort, isSortReverse }) => {
  const sortedData = SORTS[sortKey](data);
  const reverseSortedData = isSortReverse ? sortedData.reverse() : sortedData;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: "50%" }}>
          <Sort sortKey={"NAME"} onSort={onSort} activeSortKey={sortKey}>
            Title Name
          </Sort>
        </span>
        <span style={{ width: "50%" }}>Archive</span>
      </div>
      {reverseSortedData.map((item) => (
        <div key={item.Name} className="table-row">
          <span style={{ width: "50%" }}>{item.Name}</span>
          <span style={{ width: "50%" }}>
            <Button onClick={() => onDismiss(item.Name)}>Dismiss</Button>
          </span>
        </div>
      ))}
    </div>
  );
};

const Sort = ({ sortKey, onSort, activeSortKey, children }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey,
  });
  return (
    <Button className={sortClass} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

const Loading = () => <div>Loading...</div>;

Button.defaultProps = {
  className: "",
};

//Needs to be changed for info=1 on TasteDive data
Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Type: PropTypes.string,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const App = () => <MovieFinderClient />;

export default App;

export { Button, Search, Table };
