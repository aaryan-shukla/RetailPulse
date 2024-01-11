import React, { Component } from "react";
import "./Assets/Navbar.css";
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ["Retail", "Analysis"],
    };
  }

  componentDidMount() {}

  render() {
    const { tabs } = this.state;
    const currentPath = window.location.pathname;
    const { userName } = this.props;
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
                <a
                  href={`./${tab.toLowerCase()}`}
                  className={`tabStyle ${
                    currentPath.includes(tab.toLowerCase()) ? "activeTab" : ""
                  }`}>
                  {tab}
                </a>
              </li>
            ))}
          </ul>
          <div className="profileName">{userName}</div>
        </nav>
      </header>
    );
  }
}
