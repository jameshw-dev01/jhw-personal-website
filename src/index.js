'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import {Board} from './wordle/board'
import GuessBoard from './wordle/guessor-board'

class Section extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div class="row bg-secondary bg-opacity-50 shadow">
                <div class="col-md-6 d-flex justify-content-center">
                    <img class="rounded mx-auto d-block m-5" style={{width:"auto", height: "auto", maxWidth:"100%", maxHeight: "100%"}} src={this.props.image}/>
                </div>
                <div class="col-md-6">
                <div class="m-2">
                    <h3 class="text-primary">{this.props.title}</h3>
                    <h4>{this.props.subtitle}</h4>
                    <ul>
                    {this.props.contents && this.props.contents.map((info)=> {return <li>{"- " + info}</li>})}
                    </ul>
                </div>
                </div>
            </div>
        );
    }
}
let netProps = {
    title: "C#: 2 years experience", 
    subtitle: ".NET Framework, Core and ASP.NetCore",
    image: "img/dotnet-logo.png",
    contents: ["Profound Medical: Ported a large (1M lines) application from .NET Framework 4.8 to .NET 6",
"Profound Medical: Built an Automated UI test framework to test that application",
"Profound Medical: Built a simulator that emulates MRI scanning an object in different orientations",
"Profound Medical: Rewrote a WebSockets application to use ASP.NetCore"]
}
let pythonProps = {
    title: "Python: 3 years experience",
    subtitle: "NumPy, Matplotlib, OpenCV, PyTorch",
    image: "img/python-logo.png",
    contents: [
        "CSC320 Intro Visual Computing: Used Numpy and OpenCV for image processing assignments",
        "CSC311 Intro Machine Learning: Used Numpy, Matplotlib and Pytorch for machine learning tasks and visualizations",
        "CSC384 Intro Artificial Intelligence: Used Python to play Checkers and do parts of speech tagging",
        "Analyzed course evaluations to find trends in difficulty",
        "Created a Wordle solver that works perfectly on the standard word list"
    ]
}
let cProps = {
    title: "C: 1 year experience",
    subtitle: "UNIX, Physics simulations",
    image: "img/clang.png",
    contents: [
        "CSC369 Operating Systems: Used C to implement a threading library and a simple file system",
        "Profound Medical: Ported ultrasound heating simulation from C to Dotnet 6"
    ]
}

class Main extends React.Component {
    render() {
        return(
        <>
        <div class="m-2">
            <h1 class="text-center">Languages</h1>
                <Section {...netProps}/>
                <Section {...pythonProps}/>
                <Section {...cProps}/>
        </div>
        <div class="row">
            <div class="col-md-6 d-flex justify-content-center">
                <div>
                    <h3>My Wordle copy</h3>
                    <Board/>
                </div>
            </div>
            <div class="col-md-6 d-flex justify-content-center">
                <div>
                    <h3>Wordle solver</h3>
                    <GuessBoard/>
                </div>
            </div>
        </div>
        </>);
    }
}

const e = React.createElement;
const domContainer = document.querySelector('#main');
ReactDOM.render(e(Main), domContainer);
