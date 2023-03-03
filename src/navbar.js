import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(props) {
    return (<nav>
        <div class="container-fluid">
            <div class="navbar-expand" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <Link to="/" class="nav-link" aria-current="page">Home</Link>
                </li>
                <li class="nav-item">
                    <Link to="wordle" class="nav-link">Wordle</Link>
                </li>
            </ul>
            </div>
        </div>
    </nav>)
}