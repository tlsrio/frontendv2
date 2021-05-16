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
  Tabs, 
  Tab,
  Nav
} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton";
import axios from "axios";
import validator from "validator"
axios.defaults.withCredentials = true;

export default function Summarize() {
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [articleText, setText] = useState("")
  const [inputType, setInputType] = useState("link")
  const [summary, setSummary] = useState({text: "", reduced_by: 0});
  const [sentiment, setSentiment] = useState({label: "", score: 0});
  const [answer, setAnswer] = useState({answer: "", score: 0});
  const { isAuthenticated, userId } = useAppContext();
  // console.log("userId:", userId);

  // Form fields
  var [fields, handleFieldChange] = useFields({
    text: "",
    link: "",
    question: "",
  });

  function changeInputType(key) {
    if (key === "link")
      setInputType("link");
    else
      setInputType("text");
  }

  function validateTextForm() {
    if (inputType === "link")
      return validator.isURL(fields.link);
    else
      return fields.text.length > 0;
  }

  function handleSubmitTextForm(event) {
    event.preventDefault();
    handleSubmitText()
  }

  async function handleSubmitText(){
    setIsLoadingSummary(true);
    const article = {
      text: "",
    }

    if(inputType === "link") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/urlToText`,
          {link: fields.link}
        )
        setText(res.data.text)
        article.text = res.data.text;
      } catch (e) {
        console.log(e);
      }
    } else {
      setText(fields.text);
      article.text = fields.text;
    }

    try{
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/summarize`,
        article
      );
      setSummary({text: res.data.summary, reduced_by: res.data.reducedBy});

      const resSen = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/sentiment`,
        { text: res.data.summary }
      );
      
      setSentiment({label: resSen.data.label, score: resSen.data.score})
    } catch (e) {
      console.log(e);
    }
    setAnswer({answer: "", score: 0});
    setIsLoadingSummary(false);
  }

  function handleSubmitQuestionForm(event) {
    event.preventDefault();
    handleSubmitQuestion()
  }

  async function handleSubmitQuestion(){
    setIsLoadingAnswer(true);
    const qa = {
      question: fields.question,
      text: articleText,
    }

    try{
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/QA`,
        qa
      );
      setAnswer({answer: res.data.answer, score: res.data.score});

    } catch (e) {
      console.log(e);
    }
    setIsLoadingAnswer(false);
  }


  function renderArticleForm() {
    return (

      <Form onSubmit={handleSubmitTextForm}>
        <Tab.Container defaultActiveKey="link" onSelect={changeInputType} id="text-tab">
          <Col>
            <Row className="justify-content-center">
              <Nav variant="tabs" className="flex-row" style={{fontSize: "30px"}}>
                <Nav.Item>
                  <Nav.Link eventKey="link">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="text">Text</Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>

            <Row className="justify-content-center" style={{marginTop: "3vh"}}>
              <Tab.Content style={{ width: "90%" }}>
                <Tab.Pane eventKey="link">
                  <h5>Enter url for the page to summarize:</h5>
                  <Form.Control
                    id="link"
                    value={fields.link}
                    onChange={handleFieldChange}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="text">
                  <h5>Enter text to summarize:</h5>
                  <Form.Control
                    id="text"
                    value={fields.text}
                    as="textarea"
                    rows={15}
                    onChange={handleFieldChange}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Row>
          </Col>
        </Tab.Container>

        <Row className="justify-content-md-center" style={{marginTop: "5vh"}}>
          <LoadingButton type="submit" isLoading={isLoadingSummary}
            disabled={!validateTextForm()}>
            Summarize
          </LoadingButton>
        </Row>

      </Form>
    );
  }

  function renderSummary() {
    return(
      <Tab.Container defaultActiveKey="summary" onSelect={changeInputType} id="text-tab">
          <Col style={{marginTop: "6vh"}}>
            <Row className="justify-content-center">
              <Nav variant="tabs" className="flex-row" style={{fontSize: "20px"}}>
                <Nav.Item>
                  <Nav.Link eventKey="summary">Summary</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="sentiment">Sentiment</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="qa">Questions</Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>

            <Row className="justify-content-center" style={{marginTop: "3vh"}}>
              <Tab.Content style={{ width: "90%" }}>
                <Tab.Pane eventKey="summary">
                  <div>
                    {summary.text}
                    <br/> <br/>
                    {`Original text reduced by ${summary.reduced_by}%.`}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="sentiment">
                  <h4>Sentiment Analysis:</h4>
                  <br/>
                  {sentiment.label}
                  <br/>
                  Score: {sentiment.score}

                </Tab.Pane>

                <Tab.Pane eventKey="qa">
                  <h4>Extractive Question Answering:</h4>
                  <br/>
                  <Form onSubmit={handleSubmitQuestionForm}>
                    <Row className="flex-row"> 
                      <Col> <h5>Ask a question:</h5> </Col>
                      <Col xs={9}> <Form.Control id="question" value={fields.question}
                        onChange={handleFieldChange}/> </Col>
                    </Row>
                    <LoadingButton type="submit" isLoading={isLoadingAnswer}
                      disabled={fields.question.length == 0} style={{marginTop: "2vh"}}>
                      Ask
                    </LoadingButton>
                  </Form>
                  <div style={{marginTop: "3vh"}}>
                    {(isLoadingAnswer || answer.answer.length == 0 ? <></> : 
                    <Fade> <p>{answer.answer}</p> <p>Score: {answer.score}</p></Fade>)}
                  </div>
                </Tab.Pane>
                
              </Tab.Content>
            </Row>

          </Col>
      </Tab.Container>

      /*9
      <div>
        {summary.text}
        <br/>
        {`Original text reduced by ${summary.reduced_by}%.`}
      </div>
      */
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

        {renderArticleForm()}
        {(isLoadingSummary || summary.text.length == 0) ? <></> : <Fade>{renderSummary()}</Fade>}
      </Fade>
    </Container>
  );
}
