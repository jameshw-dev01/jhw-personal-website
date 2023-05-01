import React from 'react'
import NavBar from '../navbar'

function WikiContext(props) {
    let split_obj = props.text.split("*")
    return <>{split_obj[0]}
            <a href={"https://en.wikipedia.org"+props.link}>{split_obj[1]}</a>
            {split_obj[2]}</>
}
export default class WikiPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            start_link: '/wiki/Leo_Tolstoy',
            end_link: '/wiki/Dolphin',
            searched_links: [],
            titles: [],
            intros: [],
            contexts: [],
            help_text: ""
        };
        this.sendGameInfo = this.sendGameInfo.bind(this);
    }

    sendGameInfo() {
        this.setState({help_text: "Processing, please wait"})
        fetch("http://164.92.141.228:8000/api?start="+encodeURIComponent(this.state.start_link)+"&end="+encodeURIComponent(this.state.end_link))
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                response.json().then(data => {
                    this.setState({
                        searched_links: data["searched_links"],
                        titles: data["titles"],
                        intros: data["intros"],
                        contexts: data["link_contexts"],
                        help_text: ""
                    })
                })
            }
            else {
                this.setState({
                    searched_links: [],
                    titles: [],
                    intros: [],
                    contexts: [],
                    help_text: "Something went wrong"
                })
            }
        })
    }
    render() {
    return (
    <div class="gradient-background">
        <NavBar/>
        <div class="p-4">
        <h1 class="text-center text-primary">Wikipedia Pathfinder With Embeddings</h1>
        <p>
            One of my pastimes is playing the <a href="https://www.thewikigame.com/group" target="_blank" rel="noopener noreferrer">wiki game</a>
            The objective of the wiki game is to navigate to a selected page in Wikipedia from a random page, 
            using only internal wikipedia links. The wiki game is rather well known as it is often used as an example
            to show the interrelatedness of different concepts. It's the internet version of "6 degrees of separation".
        </p>
        <p>
            The game is a test of trivia knowledge and creativity in finding links between topics. For example, 
            try find a path from "Leo Tolstoy" to "Dolphin". The way most players would do it is to go through Tolstoy's page,
            looking for anything sea related. Then they would find a list of marine animals and search for dolphin in that list.
        </p>
        <p>
            I realized that text embeddings encode a measure of relatedness between words, so a program using those embeddings should
            be able to play this game. I used OpenAI's text-embedding-ada-002 model to create this solver.
        </p>
        <p><b>Q: What's so special about that? Can't you just use breadth first search to find a path?</b></p>
        <p>A: Using search algorithms is against the rules of the game because you have to backtrack. It is true that a 
        search algorithm will give a better answer (see <a href="https://www.sixdegreesofwikipedia.com/" target="_blank" rel="noopener noreferrer">Six degrees of wikipedia</a>).
        However, the point of this project is to create an AI that plays by human rules: It must select the next page
        without peeking at the contents, using just its own knowledge to guess whether the page is relevant to the target page.
        This project demonstrates that OpenAI's embeddings do in fact capture information about how words are related
        in a useful way.</p>
        <div>
            <div>Enter start article</div>
            <input type="text" value={this.state.start_link} onChange={event=>this.setState({start_link: event.target.value})}/>
            <a href={"https://en.wikipedia.org"+this.state.start_link} target="_blank" rel="noopener noreferrer">Link to Start</a>
        </div>
        <div>
            <div>Enter end article</div>
            <input type="text" value={this.state.end_link} onChange={event=>this.setState({end_link: event.target.value})}/>
            <a href={"https://en.wikipedia.org"+this.state.end_link} target="_blank" rel="noopener noreferrer">Link to End</a>
        </div>
        <button onClick={this.sendGameInfo}>Play!</button>
        <h2>Searched links</h2>
        <h3>{this.state.help_text}</h3>
        <>{this.state.searched_links.slice(0,-1).map((link, i) => {
            return <>
                        <h2><a href={"https://en.wikipedia.org"+link} target="_blank" rel="noopener noreferrer">{this.state.titles[i]}</a></h2>
                        <p>{this.state.intros[i]}</p>
                        <p>...</p>
                        <p>...</p>
                        <p><WikiContext text={this.state.contexts[i]} link={this.state.searched_links[i+1]} target="_blank" rel="noopener noreferrer"/></p>
                    </>
            })}</>
        </div>
    </div>)
    }
}