import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../libs/context";
import { useFields } from "../libs/hooks";
import Fade from "react-reveal/Fade";
import {
  Container,
  Row,
  Col,
  Form,
  Modal,
  Button,
  Grid,
} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function Home() {
  const { isLoadingSummary, setIsLoadingSummary } = useState(true);
  const { isLoadingAnswer, setIsLoadingAnswer } = useState(true);

  const { isAuthenticated, userId } = useAppContext();
  // console.log("userId:", userId);

  // Form fields
  var [fields, handleFieldChange] = useFields({
    text: "",
  }); // todo: add question

  function validateTextForm() {
    return fields.text.length > 0;
  }

  async function handleSubmitText() {}
  // todo: should we combine these are determine if input is text or link??
  //   function renderArticleLinkForm() {}
  function renderArticleTextForm() {
    return (
      <Form onSubmit={handleSubmitText}>
        <Form.Group>
          <Form.Control
            id="text"
            value={fields.text}
            as="textarea"
            rows={20}
            onChange={handleFieldChange}
            style={{ width: "100%" }}
          />
        </Form.Group>

        <Row className="justify-content-md-center">
          <LoadingButton
            type="submit"
            isLoading={isLoadingSummary}
            disabled={!validateTextForm()}
          >
            Summarize
          </LoadingButton>
        </Row>
      </Form>
    );
  }
  function renderSummary() {}
  console.log("env: ", process.env.REACT_APP_BACKEND_URL);
  return (
    <Container>
      <Fade>
        {/* todo: use padding lol */}
        <br />
        <br />
        <Row className="justify-content-md-center">
          <h1>Too Long; Still Read</h1>
        </Row>
        <br />
        <br />

        {renderArticleTextForm()}
        {isLoadingSummary ? <></> : <>{renderSummary()}</>}
      </Fade>
    </Container>
  );
}
