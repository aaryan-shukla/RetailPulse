import React, { Component } from "react";
import "./Assets/Navbar.css";
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ["Retail", "Analysis"],
    };
    console.log("Constructor");
  }

  componentDidMount() {
    console.log("ComponentDidMount");
  }

  render() {
    const { tabs } = this.state;
    return (
      <header>
        <nav className="navStyle">
          <div>
            <span className="brandStyle">Retail</span>
            <span className="brandStyle1">Pulse</span>
          </div>
          <ul className="ulStyle">
            {tabs.map((tab) => (
              <li key={tab} style={{ marginRight: "15px" }}>
                <a href={`./${tab}`} className="tabStyle">
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  }
}
