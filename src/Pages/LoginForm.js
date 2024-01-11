import React, { Component } from "react";
import { Row } from "antd";
import "./Assets/RegistrationForm.css";
import LoginSuccessRedirect from "./LoginSuccessRedirect";
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      users: [],
      isLoading: false,
      redirectToShoppingPage: false,
      user: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/userLogin", {
      method: "POST",
      body: JSON.stringify(this.state.form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await response.json();
    this.setState({ isLoading: false });

    if (response.ok) {
      alert("User Login successful!");
      const user = data.user;
      this.setState({ redirectToShoppingPage: true, user: user });
    } else {
      alert(data.error || "User Login failed!");
    }
    console.log(data);
  };

  handleForm = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  renderLoginFormSection = () => {
    return (
      <div>
        {this.state.redirectToShoppingPage && (
          <LoginSuccessRedirect user={this.state.user} />
        )}
        <span className="registerSpan">Login</span>
        <div className="registration-form">
          <form onSubmit={this.handleSubmit}>
            <div>
              <span className="inputFieldName">EMAIL</span>
              <input
                type="text"
                name="email"
                onChange={this.handleForm}
                placeholder="abc@gmail.com"
              />
            </div>
            <br />
            <div>
              <span className="inputFieldName">Password</span>
              <input
                type="password"
                name="password"
                onChange={this.handleForm}
                placeholder="*****"
              />
            </div>
            <br />
            <div>
              <input type="submit" value="Log In" />
            </div>
          </form>
        </div>
      </div>
    );
  };

  renderHeaderLogoPart = () => {
    return (
      <section>
        <div className="header-logo-part">
          <span className="brandStyleForm">Retail</span>
          <span className="brandStyleForm1"> Pulse</span>
          <h4>
            <i>Where Every Transaction tells a story</i>
          </h4>
        </div>
      </section>
    );
  };

  render() {
    return (
      <div className="form-container">
        <Row>{this.renderHeaderLogoPart()}</Row>
        <br />
        <Row>{this.renderLoginFormSection()}</Row>
      </div>
    );
  }
}

export default LoginForm;
