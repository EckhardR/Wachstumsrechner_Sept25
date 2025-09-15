import React from "react";
import { WiTime1 } from "react-icons/wi/index.esm.js";
import { useTime } from 'react-timer-hook';


function MyTime() {
    const {
        seconds,
      minutes,
      hours,
      days,
    } = useTime({ format: '24-hour'});
  
    return (
      <>
        <div style={{fontSize: '2.4vh', fontFamily:'cursive'}} className="fw-bolder">
        {new Date().toDateString()}, <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span> 
        </div>
      </>
    );
  }

  export default MyTime;