import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { Input, Row, Select } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  SlidersOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import "./Assets/shoppingpage.css";
const { Option } = Select;
export default class ShoppingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppliedFilterClicked: false,
      showDropdowns: false,
    };
  }
  componentDidMount() {
    document.body.style.background = "none";
    this.fetchData("6593fa950574b1d36280bac4");
  }

  componentWillUnmount() {
    document.body.style.background = null;
  }
  async fetchData(productId) {
    try {
      const response = await fetch(
        "http://localhost:8080/fetchdata/6593fa950574b1d36280bac4",
        {
          method: "GET",
        }
      );
      const doc = await response.json();
      console.log(doc);
      // Do something with the fetched data, like updating component state
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }
  renderInputSection() {
    return (
      <div className="shoppingPageFirstSectionContainer">
        <div style={{ marginRight: "16px" }}>
          <div style={{ marginBottom: "8px" }}>Name</div>
          <Input
            size="large"
            placeholder="Enter your name"
            prefix={<UserOutlined />}
            style={{ width: "20rem" }}
          />
        </div>
        <div>
          <div style={{ marginBottom: "8px" }}>Email</div>
          <Input
            size="large"
            placeholder="Enter your email"
            prefix={<UserOutlined />}
            style={{ width: "20rem" }}
          />
        </div>
        <div style={{ marginLeft: "16px" }}>
          <div style={{ marginBottom: "8px" }}>Contact Number</div>
          <Input
            size="large"
            placeholder="Enter your email"
            prefix={<UserOutlined />}
            style={{ width: "20rem" }}
          />
        </div>
        <div className="inputFile">
          <div style={{ marginBottom: "8px" }}>File Upload</div>
          <label htmlFor="fileInput" className="inputLabel">
            Choose File
          </label>
          <input id="fileInput" type="file" style={{ display: "none" }} />
        </div>
        <div className="shoppingCartDiv">
          <ShoppingCartOutlined className="shoppingCart" />
        </div>
        <br />
      </div>
    );
  }
  sortOnAlphabeticalAscending() {
    console.log("sort on ascending a to z");
  }
  sortOnPrice() {
    console.log("sort on PRICE");
  }
  sortOnAlphabeticalDescending() {
    console.log("sort on descending a to z");
  }
  renderDropdownOptions() {
    console.log("Clicked filters");
    return (
      <div>
        {/* Your dropdown content here */}
        <Select defaultValue="Option1" className="dropdownOptions">
          <Option value="Option1">Option 1</Option>
          <Option value="Option2">Option 2</Option>
          <Option value="Option3">Option 3</Option>
        </Select>
        <button className="sortButton" onClick={this.sortOnPrice}>
          <SlidersOutlined /> Price High to Low
        </button>
        <button
          className="sortButton"
          onClick={this.sortOnAlphabeticalAscending}>
          <SortAscendingOutlined /> A to Z
        </button>
        <button
          className="sortButton"
          onClick={this.sortOnAlphabeticalDescending}>
          <SortDescendingOutlined />Z to A
        </button>
      </div>
    );
  }
  toggleDropdowns = () => {
    this.setState((prevState) => ({
      showDropdowns: !prevState.showDropdowns,
    }));
  };
  renderFilterSection() {
    console.log(this.state.showDropdowns);
    return (
      <div className="filterIconDiv">
        <br />
        <button
          className={`filterButton ${this.state.showDropdowns ? "active" : ""}`}
          onClick={this.toggleDropdowns}>
          <FilterOutlined className="filterIcon" />
        </button>
        <span className="filterButtonSideSpan">
          {this.state.showDropdowns ? "Hide Filters" : "Apply Filters"}
        </span>
        {this.state.showDropdowns && this.renderDropdownOptions()}
      </div>
    );
  }
  renderProductDisplaySection() {
    const productData = {
      _id: {
        $oid: "659ae1c111603f6c22672995",
      },
      id: "6593fa950574b1d36280bac4",
      user_name: "Aaryan",
      product_name: "Beans - Turtle, Black, Dry",
      category: "Snacks",
      product_price: 165,
      quantity: 82,
    };
    const discountOptions = Array.from({ length: 21 }, (_, index) => index * 5);
    const handleQuantityChange = (increment) => {
      // Handle quantity change based on increment (+1 or -1)
      console.log("Quantity changed:", increment);
    };

    return (
      <div className="containerStyle">
        <div className="productDisplayStyle">
          <div className="productInfoStyle">
            <span
              style={{
                marginRight: "5rem",
                fontSize: "15px",
                fontFamily: "sans-serif",
              }}>
              <b>{productData.product_name}</b>
            </span>
            <span className="keyStyleForProductDivNames">
              <b>In Stock</b>
            </span>
            <div className="inStockStyle">{productData.quantity}</div>
            <label className="keyStyleForProductDivNames">
              <b>Discount:</b>
            </label>
            <select className="discountOptions">
              {discountOptions.map((discount) => (
                <option key={discount} value={discount}>
                  {discount}% Off
                </option>
              ))}
            </select>
          </div>
          <span style={{ marginRight: "10px" }}>
            Price: {productData.product_price} <b>₹</b>
          </span>
          <div>
            <button onClick={() => handleQuantityChange(-1)}>-</button>
            <span className="quantityDisplayStyle">{productData.quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Navbar />
        <section>
          <Row>{this.renderInputSection()}</Row>
        </section>
        <section>
          <Row>{this.renderFilterSection()}</Row>
        </section>
        <br />
        <section>
          <Row>{this.renderProductDisplaySection()}</Row>
        </section>
      </div>
    );
  }
}
