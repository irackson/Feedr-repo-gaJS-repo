import React from 'react';
import Article from './Article.js';
import SourceSelector from './SourceSelector.js';
import './styles/html5bp.css';
import './styles/Main.css';
import './styles/normalize.css';

require('dotenv').config();
async function getFeed(sources, numDisplay) {
    let articleArray = [];

    for (let i = 0; i < sources.length; i++) {
        if (sources[i] === 'Krzana Covid') {
            // await articleArray.push(await getKrzana(numDisplay));
        } else if (sources[i] === 'NYTimes Popular') {
            await articleArray.push(await getNYTimes(numDisplay));
        } else if (sources[i] === 'Guardian Coding') {
            await articleArray.push(await getGuardianCoding(numDisplay));
        } else if (sources[i] === 'SpaceFlight News') {
            await articleArray.push(await getSpaceFlightNews(numDisplay));
        }
    }

    return new Promise(function (myResolve) {
        myResolve(articleArray);
    });
}

async function getKrzana(numDisplay) {
    let result = [];
    try {
        const response = await fetch(
            'https://api.krzana.com/v3/publications?channel_ids[]=32739&limit=10'
        );
        result = await response.json();
    } catch (error) {
        console.error(error.message);
    }

    let articles = [];
    for (let i = 0; i < result.length; i++) {
        if (
            articles.length < numDisplay &&
            result[i]?.thumbnail !== null &&
            result[i]?.type === 'Article' &&
            result[i]?.origin !== 'The Guardian'
        ) {
            const url = result[i].source_url;
            const title = result[i].text;
            const tag = result[i].origin;
            const date = result[i].created_at;
            const text = result[i].teaser_text;
            const thumbnail = result[i].thumbnail;

            const article = [url, title, tag, date, text, thumbnail];
            articles.push(article);
        }
    }
    return new Promise(function (myResolve) {
        const product = ['Krzana Covid', articles];
        myResolve(product);
    });
}

async function getNYTimes(numDisplay) {
    let result = [];
    try {
        const response = await fetch(
            `https://api.nytimes.com/svc/mostpopular/v2/emailed/1.json?api-key=${process.env.REACT_APP_NYT_KEY}`
        );
        result = await response.json();
    } catch (error) {
        console.error(error.message);
    }

    let articles = [];
    for (let i = 0; i < result.results.length; i++) {
        if (
            articles.length < numDisplay &&
            result.results[i].media.length !== 0
        ) {
            const url = result.results[i].url;
            const title = result.results[i].title;
            const tag = result.results[i].section;
            const date = result.results[i].published_date;
            const text = result.results[i].abstract;
            const thumbnail =
                result.results[i].media[0]['media-metadata'][0].url;

            const article = [url, title, tag, date, text, thumbnail];
            articles.push(article);
        }
    }
    return new Promise(function (myResolve) {
        const product = ['NYTimes Popular', articles];
        myResolve(product);
    });
}

async function getGuardianCoding(numDisplay) {
    let result = [];
    try {
        const response = await fetch(
            `https://content.guardianapis.com/search?show-fields=thumbnail&page-size=10&q=artificial%20intelligence%20computer%20programming%20software%20development&api-key=${process.env.REACT_APP_GUARDIAN_KEY}`
        );
        const result_temp = await response.json();
        result = result_temp.response.results;
    } catch (error) {
        console.error(error.message);
    }

    let articles = [];
    for (let i = 0; i < result.length; i++) {
        if (articles.length < numDisplay) {
            const url = result[i].webUrl;
            const title = result[i].webTitle;
            const tag = result[i].sectionName;
            const date = result[i].webPublicationDate;
            const text =
                'Read the dang article!!! The Guardian does not supply an abstract for a reason...';
            const thumbnail = result[i]?.fields?.thumbnail;
            const article = [url, title, tag, date, text, thumbnail];
            articles.push(article);
        }
    }

    return new Promise(function (myResolve) {
        const product = ['Guardian Coding', articles];
        myResolve(product);
    });
}

async function getSpaceFlightNews(numDisplay) {
    let result = [];
    try {
        const response = await fetch(
            'https://spaceflightnewsapi.net/api/v2/articles?_limit=10'
        );
        result = await response.json();
    } catch (error) {
        console.error(error.message);
    }

    let articles = [];
    for (let i = 0; i < result.length; i++) {
        if (articles.length < numDisplay) {
            const url = result[i].url;
            const title = result[i].title;
            const tag = result[i].newsSite;
            const date = result[i].publishedAt;
            const text = result[i].summary;
            const thumbnail = result[i].imageUrl;

            const article = [url, title, tag, date, text, thumbnail];
            articles.push(article);
        }
    }

    return new Promise(function (myResolve) {
        const product = ['SpaceFlight News', articles];
        myResolve(product);
    });
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            feed: [],
            sourceList: [],
            currentSource: '',
            currentSourceIndex: null,
            shouldPop: false,
            articleToPop: [],
            toggleSearchBox: false,
            showSearch: false,
            searchTerm: '',
            shouldClear: true,
        };
    }

    async componentDidMount() {
        const sources = this.props.sources;
        const feed = await getFeed(sources, 100);

        let sourceList = [];
        for (let i = 0; i < feed.length; i++) {
            sourceList[i] = feed[i][0];
        }

        const currentSource = sourceList[0];
        sourceList.shift();

        this.setState({
            loading: false,
            feed: feed,
            sourceList: sourceList,
            currentSource: currentSource,
        });
        this.update = this.update.bind(this);
        this.popDown = this.popDown.bind(this);
        this.popUp = this.popUp.bind(this);
        this.toggleSearchBox = this.toggleSearchBox.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleClear = this.toggleClear.bind(this);
    }

    toggleClear = () => {
        this.setState({ shouldClear: !this.state.shouldClear, searchTerm: '' });
    };

    handleInputChange = (e) => {
        this.setState({ searchTerm: e.target.value.toLowerCase() });
    };

    toggleSearchBox = () => {
        this.setState({ showSearch: !this.state.showSearch });
    };

    popDown = (e) => {
        e.preventDefault();

        this.setState({ shouldPop: false });
    };

    popUp = (e) => {
        e.preventDefault();
        this.setState({
            shouldPop: true,
            articleToPop: [
                e.target.nextSibling.childNodes[0].childNodes[0].innerText,
                e.target.nextSibling.childNodes[0].childNodes[1].innerText,
                e.target.nextSibling.childNodes[0].childNodes[2].innerText,
                e.target.nextSibling.childNodes[0].childNodes[3].innerText,
                e.target.nextSibling.childNodes[0].childNodes[4].innerText,
                e.target.nextSibling.childNodes[0].childNodes[5].innerText,
            ],
        });
    };

    update = (e) => {
        e.preventDefault();

        const newCurrentSource = e.target.innerText;
        const newSourceList = this.state.sourceList.filter(
            (s) => s !== newCurrentSource
        );
        newSourceList.push(this.state.currentSource);
        this.setState({
            sourceList: newSourceList,
            currentSource: newCurrentSource,
        });
    };

    render() {
        let currentSourceFeed;

        if (!this.state.loading) {
            let currentSourceIndex;
            for (let i = 0; i < this.state.feed.length; i++) {
                if (this.state.feed[i][0] === this.state.currentSource) {
                    currentSourceIndex = i;
                }
            }
            currentSourceFeed = this.state.feed[currentSourceIndex][1];
        }

        function isMatch(article, searchTerm) {
            if (searchTerm === '' || searchTerm === null) {
                return true;
            } else {
                for (let i = 0; i < article.length; i++) {
                    if (
                        article[i]?.toUpperCase().includes(searchTerm) ||
                        article[i]?.toLowerCase().includes(searchTerm)
                    ) {
                        return true;
                    }
                }
                return false;
            }
        }

        return (
            <div>
                {this.state.loading ? (
                    <div id="popUp" className="loader"></div>
                ) : (
                    <>
                        <header>
                            <section className="container">
                                <a href="..">
                                    <h1>Feedr</h1>
                                </a>
                                <nav>
                                    <ul>
                                        <li>
                                            <button
                                                href="#"
                                                className="link-to-button"
                                            >
                                                News Source:{' '}
                                                <span>
                                                    {this.state.currentSource}
                                                </span>
                                            </button>
                                            <SourceSelector
                                                sourceList={
                                                    this.state.sourceList
                                                }
                                                update={this.update}
                                            />
                                        </li>
                                    </ul>
                                    <section id="search">
                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                this.state.shouldClear
                                                    ? null
                                                    : this.state.searchTerm
                                            }
                                            style={
                                                this.state.showSearch
                                                    ? { display: 'block' }
                                                    : { visibility: 'hidden' }
                                            }
                                            onMouseLeave={this.toggleSearchBox}
                                            onChange={(e) =>
                                                this.handleInputChange(e)
                                            }
                                        />
                                        <a
                                            href="#"
                                            onMouseEnter={this.toggleSearchBox}
                                            onClick={this.toggleClear}
                                        ></a>
                                    </section>
                                </nav>
                                <div className="clearfix"></div>
                            </section>
                        </header>
                        <section id="main" className="container">
                            <div>
                                <ul>
                                    {currentSourceFeed.map((article, i) =>
                                        isMatch(
                                            article,
                                            this.state.searchTerm
                                        ) ? (
                                            <li key={i}>
                                                <Article
                                                    article={article}
                                                    articleToPop={
                                                        this.state.articleToPop
                                                    }
                                                    shouldPop={
                                                        this.state.shouldPop
                                                    }
                                                    popDown={this.popDown}
                                                    popUp={this.popUp}
                                                />
                                            </li>
                                        ) : (
                                            <span key={i}></span>
                                        )
                                    )}
                                </ul>
                            </div>
                        </section>
                    </>
                )}
            </div>
        );
    }
}

export default Main;
