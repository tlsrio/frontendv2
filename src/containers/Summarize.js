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

export default function Summarize() {
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(true);
  const [summary, setSummary] = useState({text: "", reduced_by: 0});
  const { isAuthenticated, userId } = useAppContext();
  // console.log("userId:", userId);

  // Form fields
  var [fields, handleFieldChange] = useFields({
    text: "",
  }); // TODO: add question

  function validateTextForm() {
    return fields.text.length > 0;
  }

  function handleSubmitTextForm(event) {
    event.preventDefault();
    handleSubmitText()
  }

  async function handleSubmitText(){
    setIsLoadingSummary(true);
    const article = {
      text: fields.text
    }
    try{
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/summarize`,
        article
      );
      console.log(res.data);
      setSummary({text: res.data.text, reduced_by: res.data.reduced_by});
    } catch (e) {
      console.log(e);
    }
    fields.text = "";
    setIsLoadingSummary(false);
  }
  // TODO: should we combine these are determine if input is text or link??
  //   function renderArticleLinkForm() {}
  function renderArticleTextForm() {
    return (
      <Form onSubmit={handleSubmitTextForm}>
        <Form.Group>
          <Form.Control
            id="text"
            value={fields.text}
            as="textarea"
            rows={15}
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

  function renderSummary() {
    return(
      <div>
        {summary.text}
        <br/>
        {`Original text reduced by ${summary.reduced_by}%.`}
      </div>
    )
  }

  return (
    <Container>
      <Fade>
        {/* TODO: use padding lol */}
        <br />
        <br />
        <Row className="justify-content-md-center">
          <h1>Too Long; Still Read</h1>
        </Row>
        <br />
        <br />

        {renderArticleTextForm()}
        {(isLoadingSummary || summary.text.length == 0) ? <></> : <Fade>{renderSummary()}</Fade>}
      </Fade>
    </Container>
  );
}
