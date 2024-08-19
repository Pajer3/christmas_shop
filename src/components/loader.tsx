"use client";
import React from 'react';
import '../styles/Loader.css'; // Create a corresponding CSS file for styles

const Loader = () => {
  return (
        <div className="loader-overlay">
<div className="snowflakes" aria-hidden="true">
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
  <div className="snowflake">
    <div className="inner">❅</div>
  </div>
</div>
        <div className="loader-center">
            <div className="loader-animation">
                🎄 Loading...
            </div>
        </div>
        <img src="https://media.baamboozle.com/uploads/images/486299/1640253547_23606_gif-url.gif" alt="Christmas GIF" className="christmas-gif" />
    </div>
  );
};

export default Loader;
