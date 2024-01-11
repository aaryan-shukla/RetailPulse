import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { Input, Row, Select, Space, Table } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import "./Assets/shoppingpage.css";
import { useNavigation } from "../Context/navigationProvider";

const { Option } = Select;
const { Search } = Input;

const ShoppingPageWithNavigation = () => {
  const { navigationData } = useNavigation();

  return <ShoppingPage navigationData={navigationData} />;
};
export default ShoppingPageWithNavigation;
class ShoppingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdowns: false,
      sortIndicator: null,
      sortDirection: "asc",
      productData: [],
      quantityInCart: {},
      categoryFilter: [],
      filteredProductData: [],
      userInfoData: {},
    };
  }
  componentDidMount() {
    document.body.style.background = "none";
    const { user } = this.props.navigationData;
    this.setState({ userInfoData: user }, () => {
      console.log(user);
    });
    const userId = user._id;
    this.fetchData(userId);
  }

  componentWillUnmount() {
    document.body.style.background = null;
  }
  async fetchData(userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/fetchdata/${userId}`,
        {
          method: "GET",
        }
      );
      const doc = await response.json();
      const initialQuantityInCart = {};
      doc.forEach((product) => {
        initialQuantityInCart[product._id] = 0;
      });
      const uniqueCategories = [...new Set(doc.map((obj) => obj.category))];

      this.setState({
        productData: doc,
        quantityInCart: initialQuantityInCart,
        categoryFilter: uniqueCategories,
      });
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

  sortOnPrice = () => {
    const { sortDirection, filteredProductData, productData } = this.state;

    const newDirection = sortDirection === "asc" ? "desc" : "asc";

    this.setState({
      sortIndicator: "price",
      sortDirection: newDirection,
    });
    const dataToSort = filteredProductData.length
      ? filteredProductData.slice()
      : productData.slice();

    const sortedData = dataToSort.sort((a, b) => {
      const priceA = a.product_price;
      const priceB = b.product_price;

      if (newDirection === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    this.setState({
      filteredProductData: sortedData,
    });
  };

  handleCategoryChange = (value) => {
    // Filter the productData based on the selected category
    const filteredData = this.state.productData.filter(
      (product) => product.category === value
    );

    this.setState({
      filteredProductData: filteredData,
    });
  };
  onSearch = (value) => {
    const { productData } = this.state;

    if (value.trim() === "") {
      // If the search value is empty, do not update filteredProductData
      return;
    }

    // If there is a search value, filter the product data based on the search query
    const searchFilteredData = productData.filter((product) =>
      product.product_name.toLowerCase().includes(value.toLowerCase())
    );

    console.log("search data", searchFilteredData);

    // Update the state with the filtered data
    this.setState({
      filteredProductData:
        searchFilteredData.length > 0 ? searchFilteredData : [],
    });
  };

  renderDropdownOptions() {
    const { categoryFilter } = this.state;
    return (
      <div>
        <Select
          defaultValue={categoryFilter[0] || "option1"}
          className="dropdownOptions"
          onChange={this.handleCategoryChange}>
          {categoryFilter.map((categories) => (
            <option key={categories} value={categories}>
              {categories}
            </option>
          ))}
        </Select>
        <button
          className={`sortButton ${
            this.state.sortIndicator === "price" ? "active" : ""
          }`}
          onClick={this.sortOnPrice}>
          <SlidersOutlined /> Price{" "}
          {this.state.sortDirection === "asc" ? "High to Low" : "Low to High"}
        </button>
        <Search
          placeholder="input search text"
          onSearch={this.onSearch}
          style={{ width: "30rem" }}
          className="sortButton"
        />
      </div>
    );
  }
  toggleDropdowns = () => {
    this.setState((prevState) => ({
      showDropdowns: !prevState.showDropdowns,
    }));
  };
  renderFilterSection() {
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
    const discountOptions = Array.from({ length: 21 }, (_, index) => index * 5);

    const handleQuantityChange = (productId, increment) => {
      const currentQuantity = this.state.quantityInCart[productId] || 0;

      const newQuantity = currentQuantity + increment;
      const finalQuantity = Math.max(newQuantity, 0);
      this.setState((prevState) => ({
        quantityInCart: {
          ...prevState.quantityInCart,
          [productId]: finalQuantity,
        },
      }));
    };
    const dataToDisplay = this.state.filteredProductData.length
      ? this.state.filteredProductData
      : this.state.productData;
    const columns = [
      {
        title: "Product Name",
        dataIndex: "product_name",
        key: "product_name",
      },
      {
        title: "In Stock",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        render: () => (
          <Select className="discountOptions" defaultValue={0}>
            {discountOptions.map((discount) => (
              <Option key={discount} value={discount}>
                {discount}% Off
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "Price",
        dataIndex: "product_price",
        key: "product_price",
        render: (text) => <span>{text} ₹</span>,
      },
    ];
    if (this.state.productData.length > 0) {
      columns.push({
        title: "Product Count in Cart",
        key: "action",
        render: (record) => {
          return (
            <Space size="middle">
              <button
                className="quantityChangeButton"
                onClick={() => handleQuantityChange(record._id, -1)}>
                -
              </button>
              <span className="quantityDisplayStyle">
                {this.state.quantityInCart[record._id] || 0}
              </span>
              <button
                className="quantityChangeButton"
                onClick={() => handleQuantityChange(record._id, 1)}>
                +
              </button>
            </Space>
          );
        },
      });
    }

    return (
      <div className="containerStyle">
        <Table dataSource={dataToDisplay} columns={columns} rowKey="_id" />
      </div>
    );
  }

  render() {
    const userName = this.state.userInfoData.username;
    return (
      <div>
        <Navbar userName={userName} />
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

// export default ShoppingPage;
