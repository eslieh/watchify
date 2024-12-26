import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Home.js';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Activity from './pages/Activity';
import Subscription from './pages/Subscription.js';
import Watch from './pages/Watch.js';
import Errorpage from './pages/Errorpage.js';
import Search from './pages/Search.js';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index/>,
    errorElement: <Errorpage/>
  },
  {
    path: "/Auth",
    element: <Auth/>,
    errorElement: <Errorpage/>
  },
  {
    path: "/Account",
    element: <Account/>,
    errorElement: <Errorpage/>
  },
  {
    path: "/Subscription",
    element: <Subscription/>,
    errorElement: <Errorpage/>
  }, 
   
  {
    path: "/watch/:id",
    element: <Watch/>,
    errorElement: <Errorpage/>
  },
  {
    path: "/Activity",
    element: <Activity/>,
    errorElement: <Errorpage/>
  },
  {
    path: "/Search",
    element: <Search/>,
    errorElement: <Errorpage/>
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router}/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
