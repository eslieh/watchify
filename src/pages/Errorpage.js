import React from 'react';
import { useRouteError } from 'react-router-dom';
import Topbar from '../components/Topbar';
function Errorpage(){
  const error = useRouteError();
  console.log(error)
  return(
    <>
    <Topbar/>
      <main>
        <h1>Whoops! Something went wrong, try again later</h1>
      </main>
    </>
    
  )
};


export default Errorpage;