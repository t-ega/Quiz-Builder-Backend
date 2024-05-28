import React from "react";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="nav-item">
        <i className="fa-solid fa-chart-line fa-2xl"></i>
        <p>Dashboard</p>
      </div>
      <hr></hr>
      <div className="nav-item">
        <i className="fa-brands fa-teamspeak fa-2xl"></i>
        <p>Quizzes</p>
      </div>
      <hr></hr>
      <div className="nav-item">
        <i className="fa-solid fa-square-poll-vertical fa-2xl"></i>
        <p>Results</p>
      </div>
      <hr></hr>
    </div>
  );
};

export default SideBar;
