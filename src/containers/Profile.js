import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import axios from "axios";
import { useAppContext } from "../libs/context";

axios.defaults.withCredentials = true;

export default function Profile() {
  const { userId, username } = useAppContext();
  const { id } = useParams();
  var ownPage;
  if (id === userId) {
    ownPage = true;
  } else {
    ownPage = false;
  }

  return (
    <Container>
      <Fade>
        <h1>{username}</h1>
      </Fade>
    </Container>
  );
}
