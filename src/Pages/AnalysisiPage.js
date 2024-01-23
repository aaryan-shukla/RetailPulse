import React, { Component, useEffect } from "react";
import { useNavigation } from "../Context/navigationProvider";
import Navbar from "../components/Navbar";
import { Card, Row, Modal, Tooltip } from "antd";
import "./Assets/analysispage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
} from "recharts";
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
    document.body.style.background = "#FAF9F6";
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

    const lineChartData = this.calculateTotalSalesByDate();
    const barChartData = this.calculateMonthlyComparison();
    console.log("bar chart data", barChartData);
    return (
      <div className="headerDiv">
        <div>
          <p className="analysisHeading">Sales Analysis</p>
        </div>
        <CalendarOutlined
          className="calendarIconStyle"
          onClick={this.showModal}
        />
        <Card className="chartsCard">
          <div className="containerStyleA">
            <h2>Total Sales</h2>
            <div className="selectedDateRangeStyle">
              {startDate && endDate && (
                <p>
                  Selected Date Range: {startDate.toLocaleDateString()} to{" "}
                  {endDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <LineChart
            width={1200}
            height={250}
            data={lineChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="6 6" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#218BE2"
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </Card>
        <br />
        <Card className="chartsCard">
          <div className="containerStyleA">
            <h2>Sale Comparision over the Month</h2>
            <div className="selectedDateRangeStyle">
              {startDate && endDate && (
                <p>
                  Selected Date Range: {startDate.toLocaleDateString()} to{" "}
                  {endDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <BarChart width={1200} height={250} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSales" fill="#8884d8" />
          </BarChart>
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
  calculateTotalSalesByDate = () => {
    const { analysisData, startDate, endDate } = this.state;
    console.log(startDate, endDate);
    const totalSalesByDate = {};

    analysisData.forEach((entry) => {
      const date = entry.date;
      const billAmountForDay = entry.billAmount || 0;
      const formattedDate = this.formatDateToCommonFormat(date);
      console.log("fo", date, formattedDate);
      if (
        startDate &&
        endDate &&
        new Date(formattedDate) >=
          new Date(
            this.formatDateToCommonFormat(startDate.toLocaleDateString())
          ) &&
        new Date(formattedDate) <=
          new Date(this.formatDateToCommonFormat(endDate.toLocaleDateString()))
      ) {
        if (totalSalesByDate[formattedDate]) {
          totalSalesByDate[formattedDate] += billAmountForDay;
        } else {
          totalSalesByDate[formattedDate] = billAmountForDay;
        }
      }
    });

    // Filter out dates without data
    const formattedSalesData = Object.keys(totalSalesByDate).map((dateKey) => ({
      date: dateKey,
      totalSales: totalSalesByDate[dateKey],
    }));
    formattedSalesData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return formattedSalesData;
  };
  calculateMonthlyComparison = () => {
    const { analysisData, startDate, endDate } = this.state;
    const totalSalesByMonth = {};

    analysisData.forEach((entry) => {
      const date = entry.date;
      const billAmountForDay = entry.billAmount || 0;
      const formattedDate = this.formatDateToCommonFormat(date);

      if (
        startDate &&
        endDate &&
        new Date(formattedDate) >=
          new Date(
            this.formatDateToCommonFormat(startDate.toLocaleDateString())
          ) &&
        new Date(formattedDate) <=
          new Date(this.formatDateToCommonFormat(endDate.toLocaleDateString()))
      ) {
        const monthYear =
          formattedDate.substring(6, 10) + "-" + formattedDate.substring(0, 2);
        console.log("monthyear", monthYear);
        if (totalSalesByMonth[monthYear]) {
          totalSalesByMonth[monthYear] += billAmountForDay;
        } else {
          totalSalesByMonth[monthYear] = billAmountForDay;
        }
      }
    });

    console.log("totalsalesbymonth", totalSalesByMonth);

    const formattedSalesData = Object.keys(totalSalesByMonth).map((month) => ({
      month,
      totalSales: totalSalesByMonth[month],
    }));

    formattedSalesData.sort((a, b) => new Date(a.month) - new Date(b.month));

    return formattedSalesData;
  };

  formatDateToCommonFormat = (dateString) => {
    // Convert the date string to a common format (MM/DD/YYYY)
    const [month, day, year] = dateString.split("/");
    return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
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
