import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavLink,
  Container,
  Form,
  Button,
  FormControl,
  Nav,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/context";
import { useFields } from "./libs/hooks";
import { formatLink } from "./libs/linkutils";

import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  // state that will be passed through app context
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  async function loadUser() {
    try {
      const res = await axios.get(
        `/api/auth/getuser`,
        { withCredentials: true }
      );
      if (res.data) {
        setUsername(res.data.name);
        setUserId(res.data._id);
        userHasAuthenticated(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    loadUser();
  }, [isAuthenticated, userId]);

  const history = useHistory();
  var [fields, handleFieldChange] = useFields({
    searchTerm: "",
  });

  const googleLogin = () => {
    window.open(
      `/api/auth/google`,
      "_self"
    );
  };

  async function handleLogout() {
    const res = await axios.get(
      `/api/auth/logout`
    );
    console.log(res);
    userHasAuthenticated(false);
    setUsername("");
    setUserId("");
    history.push("/");
    history.go(0);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (fields.searchTerm !== "") {
      const term = fields.searchTerm;
      history.push(`/search?q=${formatLink(term)}`);
    } else {
      alert("Search cannot be empty. ");
    }
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          tl;sr
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink as={Link} to="/summarize">
              Summarize
            </NavLink>
            <NavLink as={Link} to="/categories">
              Categories
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink
                  disabled={false}
                  as={Link}
                  to={userId ? `/profile/${userId}` : ``}
                >
                  Profile
                </NavLink>
                <NavLink onClick={handleLogout}>Log Out</NavLink>
              </>
            ) : (
              <>
                <NavLink onClick={googleLogin}>Sign In</NavLink>
              </>
            )}
          </Nav>
          <Form inline onSubmit={handleSearchSubmit}>
            <FormControl
              className="mr-sm-2"
              id="searchTerm"
              autoFocus
              value={fields.searchTerm}
              onChange={handleFieldChange}
              placeholder="Search"
            />
            <Button type="submit" variant="outline-primary">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Container style={{ marginBottom: "30px" }}>
        <AppContext.Provider
          value={{
            isAuthenticated,
            userHasAuthenticated,
            username,
            setUsername,
            userId,
            setUserId,
          }}
        >
          <Routes />
        </AppContext.Provider>
      </Container>
    </>
  );
}

export default App;
