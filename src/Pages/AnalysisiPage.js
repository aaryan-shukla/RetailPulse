import React, { Component, useEffect } from "react";
import { useNavigation } from "../Context/navigationProvider";
import Navbar from "../components/Navbar";
import { Card, Row, Modal } from "antd";
import "./Assets/analysispage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarOutlined } from "@ant-design/icons";
const AnalysisPageWithNavigation = () => {
  const { navigationData } = useNavigation();
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(navigationData.user));
  }, [navigationData.user]);

  return <AnalysisiPage navigationData={navigationData} />;
};
export default AnalysisPageWithNavigation;
class AnalysisiPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfoData: JSON.parse(localStorage.getItem("user")) || {},
      analysisData: [],
      startDate: null,
      endDate: null,
      modalVisible: false,
    };
  }
  componentDidMount() {
    document.body.style.background = "none";
    const userId = this.state.userInfoData._id;
    this.fetchData(userId);
  }
  async fetchData(userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/fetchAnalysisData/${userId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({
        analysisData: data,
      });
      console.log("Analysis Data:", data);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  }
  renderSalesAnalytics = () => {
    const { startDate, endDate, modalVisible } = this.state;

    const containerStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    };

    const calendarIconStyle = {
      fontSize: "20px",
      cursor: "pointer",
    };
    const selectedDateRangeStyle = {
      fontSize: "14px",
    };
    return (
      <div className="headerDiv">
        <div>
          <p className="analysisHeading">Sales Analysis</p>
        </div>
        <Card className="chartsCard">
          <div style={containerStyle}>
            <CalendarOutlined
              style={calendarIconStyle}
              onClick={this.showModal}
            />
            <div style={selectedDateRangeStyle}>
              {startDate && endDate && (
                <p>
                  Selected Date Range: {startDate.toLocaleDateString()} to{" "}
                  {endDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Card>
        <Modal
          title="Select Date Range"
          visible={modalVisible}
          onCancel={this.hideModal}
          footer={null}>
          <DatePicker
            selected={startDate}
            onChange={this.handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        </Modal>
      </div>
    );
  };

  handleDateChange = (dates) => {
    const [start, end] = dates;
    this.setState({
      startDate: start,
      endDate: end,
    });
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <Navbar />
        <section>
          <Row>{this.renderSalesAnalytics()}</Row>
        </section>
      </div>
    );
  }
}
