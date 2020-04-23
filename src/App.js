import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";
const axios = require("axios");

const proxyurl = "https://cors-anywhere.herokuapp.com/";
export const authEndpoint = "https://accounts.spotify.com/authorize?";
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = "http://localhost:3000";
const baseURL = "https://api.spotify.com/v1";

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: undefined,
      userEmail: undefined,
      userUrl: undefined,
      userId: undefined,
      isAuthenticated: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleUser = this.handleUser.bind(this);
  }

  handleLogin() {
    axios
      .get(
        proxyurl +
          authEndpoint +
          "client_id=" +
          clientId +
          "&response_type=token&redirect_uri=" +
          redirectUri +
          "&scope=user-read-private%20user-read-email&state=34fFs29kd09"
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  handleUser(access_token) {
    axios
      .get(baseURL + "/me", {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          userName: response.data.display_name,
          userEmail: response.data.email,
          userUrl: response.data.href,
          userId: response.data.id,
        });
        const { userName, userEmail, userUrl, userId } = this.state;
        console.log(
          "Name: " +
            userName +
            "\nEmail: " +
            userEmail +
            "\nURL: " +
            userUrl +
            "\nId: " +
            userId
        );
      });
  }

  componentDidMount() {
    console.log(hash.access_token);
    this.handleLogin();
    this.handleUser(hash.access_token);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col lg={12}></Col>
        </Row>
      </Container>
    );
  }
}
export default App;
