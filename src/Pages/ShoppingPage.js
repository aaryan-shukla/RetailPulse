import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { Input, Row, Select, Space, Table, Modal, Button } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import "./Assets/shoppingpage.css";
import { useNavigation } from "../Context/navigationProvider";
import { viewCartTableSpecs } from "../specifications/viewCartTableSpecs";
import { Link } from "react-router-dom";

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
      isModalVisible: false,
      enteredName: "",
      enteredEmail: "",
      enteredPhoneNo: "",
      selectedProducts: {},
      selectedProductsArray: [],
      totalBill: 0,
      checkOutArray: [],
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
  handleViewCart = () => {
    const selectedProductsArray = Object.values(this.state.selectedProducts);
    const totalBill = this.calculateBill(selectedProductsArray);
    console.log("total", totalBill);
    this.setState({
      selectedProductsArray: selectedProductsArray,
      isModalVisible: true,
      totalBill: totalBill,
    });
  };

  handleModalCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  handleAddToCart = () => {
    console.log("Product added to cart!");

    this.handleModalCancel();
  };
  handleCheckOut = () => {
    const currentDate = new Date();
    const productsCount = Object.keys(this.state.selectedProducts).length;
    const utcTimestamp = currentDate.toISOString();
    const formattedDate =
      (currentDate.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      currentDate.getDate().toString().padStart(2, "0") +
      "/" +
      currentDate.getFullYear();
    console.log(this.props.navigationData);
    const finalArrayProduct = {
      userName: this.state.userInfoData.username,
      userId: this.props.navigationData.user._id,
      customerName: this.state.enteredName,
      contactNumber: this.state.enteredPhoneNo,
      email: this.state.enteredEmail,
      distinctProductCount: productsCount,
      billAmount: this.state.totalBill,
      products: this.state.selectedProducts,
      date: formattedDate,
      timestamp: utcTimestamp,
    };
    fetch("http://localhost:8080/updateBillDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalArrayProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Checkout", finalArrayProduct);
        console.log("API response:", data);
      })
      .catch((error) => {
        console.error("API error:", error);
      });
    console.log("Checkout", finalArrayProduct);
    // Inside your handleCheckOut method
    for (const productId in finalArrayProduct.products) {
      const productData = finalArrayProduct.products[productId];
      const quantityToDecrease = productData.quantity;

      fetch(`http://localhost:8080/updateStock/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantityToDecrease }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(`Product quantity updated: ${productId}`, data);
        })
        .catch((error) => {
          console.error(`Error updating product quantity: ${productId}`, error);
        });
    }
    const userId = this.state.userInfoData._id; // Use correct property name
    this.fetchData(userId);

    // Close the modal and show an alert
    this.setState(
      {
        isModalVisible: false,
      },
      () => {
        alert("Bills updated");
      }
    );
  };
  handleClear = () => {
    // Reset the name in the input field
    this.setState({
      enteredName: "",
      enteredEmail: "",
      enteredPhoneNo: "",
    });

    const clearedProducts = {};
    for (const productId in this.state.selectedProducts) {
      clearedProducts[productId] = {
        ...this.state.selectedProducts[productId],
        quantity: 0,
      };
    }

    this.setState({
      selectedProducts: {},
      quantityInCart: {},
    });

    // Close the modal
    this.handleModalCancel();
  };

  calculateSellingPrice(item) {
    return item.price - (item.discount * item.price) / 100;
  }
  calculateBill = (selectedProductsArray) => {
    const totalBill = selectedProductsArray.reduce((total, item) => {
      const sellingPrice = this.calculateSellingPrice(item);
      return total + item.quantity * sellingPrice;
    }, 0);
    return totalBill;
  };

  updateTotalBill() {
    const totalBill = this.calculateBill();
    this.setState({ totalBill });
  }
  renderInputSection(username) {
    return (
      <div className="shoppingPageFirstSectionContainer">
        <div style={{ marginRight: "16px" }}>
          <div style={{ marginBottom: "8px" }}>Name</div>
          <Input
            size="large"
            placeholder="Enter your name"
            prefix={<UserOutlined />}
            style={{ width: "20rem" }}
            onChange={(e) => this.setState({ enteredName: e.target.value })}
          />
        </div>
        <div>
          <div style={{ marginBottom: "8px" }}>Email</div>
          <Input
            size="large"
            placeholder="Enter your email"
            prefix={<UserOutlined />}
            style={{ width: "20rem" }}
            onChange={(e) => this.setState({ enteredEmail: e.target.value })}
          />
        </div>
        <div style={{ marginLeft: "16px" }}>
          <div style={{ marginBottom: "8px" }}>Contact Number</div>
          <Input
            size="large"
            placeholder="Enter your Phone NO"
            prefix={<UserOutlined />}
            style={{ width: "20rem" }}
            onChange={(e) => this.setState({ enteredPhoneNo: e.target.value })}
          />
        </div>
        <div className="inputFile">
          <div style={{ marginBottom: "8px" }}>File Upload</div>
          <label htmlFor="fileInput" className="inputLabel">
            Choose File
          </label>
          <input id="fileInput" type="file" style={{ display: "none" }} />
        </div>
        <div className="shop">
          <button className="shoppingCartDiv" onClick={this.handleViewCart}>
            <ShoppingCartOutlined className="shoppingCart" />
          </button>
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
      const selectedProductDetails = this.state.productData.find(
        (product) => product._id === productId
      );
      const selectedProduct = {
        quantity: finalQuantity,
        discount: this.state.selectedProducts[productId]
          ? this.state.selectedProducts[productId].discount
          : 0,
        name: selectedProductDetails.product_name,
        category: selectedProductDetails.category,
        price: selectedProductDetails.product_price,
      };
      if (finalQuantity === 0) {
        const { [productId]: removedProduct, ...remainingProducts } =
          this.state.selectedProducts;
        this.setState({
          quantityInCart: {
            ...this.state.quantityInCart,
            [productId]: finalQuantity,
          },
          selectedProducts: remainingProducts,
        });
      } else {
        // Update the selected product in the state
        this.setState(
          (prevState) => ({
            quantityInCart: {
              ...prevState.quantityInCart,
              [productId]: finalQuantity,
            },
            selectedProducts: {
              ...prevState.selectedProducts,
              [productId]: selectedProduct,
            },
          }),
          () => {
            // Log the updated state
            console.log(
              "Updated selectedProducts state:",
              this.state.selectedProducts
            );
          }
        );
      }
    };
    const handleDiscountChange = (productId, selectedDiscount) => {
      this.setState(
        (prevState) => ({
          selectedProducts: {
            ...prevState.selectedProducts,
            [productId]: {
              ...prevState.selectedProducts[productId],
              discount: selectedDiscount,
            },
          },
        }),
        () => {
          // Log the updated state
          console.log(
            "Updated selectedProducts state:",
            this.state.selectedProducts
          );
        }
      );
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
        render: (text, record) => (
          <Select
            className="discountOptions"
            defaultValue={0}
            onChange={(value) => handleDiscountChange(record._id, value)}>
            {discountOptions.map((discount) => (
              <Option key={discount._id} value={discount}>
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
    const { enteredName, enteredPhoneNo } = this.state;
    return (
      <div>
        <Navbar
          userName={userName}
          navigationData={this.props.navigationData}
        />
        <section>
          <Row>{this.renderInputSection(userName)}</Row>
        </section>
        <section>
          <Row>{this.renderFilterSection()}</Row>
        </section>
        <br />
        <section>
          <Row>{this.renderProductDisplaySection()}</Row>
        </section>
        <Modal
          title="Add to Cart"
          visible={this.state.isModalVisible}
          onOk={this.handleAddToCart}
          onCancel={this.handleModalCancel}
          footer={[
            <Button key="checkout" onClick={this.handleCheckOut}>
              Check Out
            </Button>,
            <Button key="submit" type="primary" danger>
              Bill
            </Button>,
            <Button key="clear" type="primary" onClick={this.handleClear}>
              Clear
            </Button>,
          ]}>
          <span>
            <p>
              <b> Customer Name: </b>
              {enteredName} <b>Customer Phone: </b>
              {enteredPhoneNo}
            </p>
          </span>
          <Table
            dataSource={this.state.selectedProductsArray.map((item) => ({
              ...item,
              sellingPrice: this.calculateSellingPrice(item),
            }))}
            columns={viewCartTableSpecs}
          />
          <div>
            <span>Total Bill :{this.state.totalBill}</span>
          </div>
        </Modal>
        <Link to={{ pathname: "/analysis", state: { username: userName } }}>
          <button>Go to Analysis Page</button>
        </Link>
      </div>
    );
  }
}
