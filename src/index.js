'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom"
import { Main } from './main';
import WordlePage from './wordle/wordle-page'

const router = createHashRouter([
    {
      path: "/",
      element: <Main/>,
    },
    {
        path: "/wordle",
        element: <WordlePage/>
    }
  ]);
ReactDOM.render(
      <RouterProvider router={router}/>, document.getElementById('main')
);