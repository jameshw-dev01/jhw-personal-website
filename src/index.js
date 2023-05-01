'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom"
import { Main } from './main';
import WordlePage from './wordle/wordle-page'
import WikiPage from './wiki-game/wiki-game-page';

const router = createHashRouter([
    {
      path: "/",
      element: <Main/>,
    },
    {
        path: "/wordle",
        element: <WordlePage/>
    },
    {
      path: "/wiki",
      element: <WikiPage/>
    }
  ]);
ReactDOM.render(
      <RouterProvider router={router}/>, document.getElementById('main')
);