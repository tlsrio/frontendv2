import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container} from "react-bootstrap";
import Fade from 'react-reveal/Fade';
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Category() {
  return (
    <Container>
      <Fade>
        <h1>CATEGORY</h1>
        <h3>UNDER CONSTRUCTION</h3>

      </Fade>
    </Container>
  );
}
