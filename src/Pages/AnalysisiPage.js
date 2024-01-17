import React, { Component } from "react";
import { useNavigation } from "../Context/navigationProvider";
import Navbar from "../components/Navbar";
const AnalysisPageWithNavigation = () => {
  const { navigationData } = useNavigation();
  return <AnalysisiPage navigationData={navigationData} />;
};
export default AnalysisPageWithNavigation;
class AnalysisiPage extends Component {
  constructor(props) {
    super(props);
    console.log("constructor of analysis page");
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Navbar />
      </div>
    );
  }
}
