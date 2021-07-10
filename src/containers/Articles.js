import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/context";
import FadeIn from "../components/Fade";
import Loading from "../components/Loading";
import {
  Container,
  Row,
  Col,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import LoadingButton from "../components/LoadingButton";
import { useFields } from "../libs/hooks";
// import ButterToast, { Cinnamon } from "butter-toast";

axios.defaults.withCredentials = true;

var articleList = [];
var commentList = [];
var favouriteArticleList = [];
var currentCategory = "";

export default function Articles(query) {
  const { isAuthenticated, username, userId } = useAppContext();
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [show, setShow] = useState(false);
  const [currentArticle, setCurrentArticle] = useState("");
  const [favouriteArticles, setFavouriteArticles] = useState([]);

  var [fields, handleFieldChange] = useFields({
    text: "",
  });

  function handleSubmitForm(event) {
    event.preventDefault();
    handleSubmit();
  }
  async function handleSubmit() {
    setIsLoadingComments(true);
    const { text } = fields;
    const newComment = {
      text: text,
      username: username,
      userId: userId,
      articleId: currentArticle._id,
    };
    try {
      const res = await axios.post(
        `/api/comments`,
        newComment
      );
      console.log(res);
    } catch (e) {
      console.log(e);
      setIsLoadingComments(false);
    }
    fields.text = "";
    loadComments(currentArticle);
    return;
  }

  function validateCommentForm() {
    return fields.text.length > 0;
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleFavourite(id, boolFav) {
    // ButterToast.raise({
    //   content: (
    //     <Cinnamon.Crisp
    //       scheme={Cinnamon.Crisp.SCHEME_BLUE}
    //       content={() => <div>You can put basically anything here.</div>}
    //       title="ButterToast example"
    //     />
    //   ),
    // });
    let path = "";
    if (boolFav) {
      path = "addfavourite"
    } else {
      path = "removefavourite"
    }
    try {
      const res = await axios.get(
        `/api/${path}/${id}`
      );
      console.log(res);
      loadFavouriteArticles();
      loadArticles();
    } catch (e) {
      console.log(e);
    }
  }

  function showComments(article) {
    setCurrentArticle(article);
    loadComments(article);
    handleShow();
  }

  function hideComments() {
    setComments({});
    setCurrentArticle({});
    handleClose();
  }

  const numArticlesPerQuery = 15; // TODO: export to env

  async function loadArticles() {
    try {
      var endpoint;
      if (query.category !== currentCategory) {
        // if category is different, restart query from page 1
        currentCategory = query.category;
        setPageNumber(1);
        endpoint = `/api/articles?pageNo=${pageNumber}&size=${numArticlesPerQuery}`;
        if (currentCategory !== "") endpoint += `&category=${currentCategory}`;
        const res = await axios(endpoint);
        articleList = res.data;
      } else {
        // if the same category, increase page number
        endpoint = `/api/articles?pageNo=${pageNumber}&size=${numArticlesPerQuery}`;
        if (currentCategory !== "") endpoint += `&category=${currentCategory}`;
        const res = await axios(endpoint);
        articleList = articleList.concat(res.data);
      }
    } catch (e) {
      console.log(e);
      alert(e);
    }
    setArticles(articleList);
    setIsLoading(false);
  }

  async function loadFavouriteArticles() {
    if (isAuthenticated) {
      try {
        const res = await axios(
          `/api/favouritearticles/${userId}`
        );
        favouriteArticleList = res.data;
      } catch (e) {
        console.log(e);
        alert(e);
      }
      setFavouriteArticles(favouriteArticleList);
    }
  }

  // todo: try with state
  async function loadComments(article) {
    setIsLoadingComments(true);
    const res = await axios.get(
      `/api/comments?articleId=${article._id}`
    );
    commentList = res.data;
    setComments(commentList);
    setIsLoadingComments(false);
  }

  useEffect(() => {
    async function onLoad() {
      await loadArticles();
      await loadFavouriteArticles();
    }
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  function loadMore(event) {
    event.preventDefault();
    setPageNumber(pageNumber + 1);
  }

  async function handleDeleteComment(event) {
    event.preventDefault();
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) {
      return;
    }
    try {
      const res = await axios.delete(
        `/api/comments/${event.target.id}`
      );
      console.log(res);
    } catch (e) {
      console.log(e);
      setIsLoadingComments(false);
    }
    fields.text = "";
    loadComments(currentArticle);
    return;

  }

  function renderModal() {
    return (
      <Modal show={show} onHide={hideComments} scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        {isLoadingComments ? (
          Loading("comments")
        ) : (
          <Modal.Body>
            <FadeIn>
              {comments.length > 0 ? (
                comments.map((comment) => {
                  return (
                    <Row key={comment._id}>
                      <Col sm={10}>
                        <b>{comment.username}:</b> {comment.text}
                      </Col>
                      <Col>
                        {comment.userId === userId ? (
                          <Button id={comment._id} onClick={handleDeleteComment}>Delete</Button>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  );
                })
              ) : (
                <>No comments</>
              )}
            </FadeIn>
          </Modal.Body>
        )}
        <Modal.Footer>
          {isAuthenticated ? (
            <Form onSubmit={handleSubmitForm} style={{ width: "100%" }}>
              <Form.Group>
                <Form.Control
                  id="text"
                  value={fields.text}
                  as="textarea"
                  style={{ resize: "none" }}
                  onChange={handleFieldChange}
                />
              </Form.Group>
              <LoadingButton
                variant="outline-dark"
                type="submit"
                disabled={!validateCommentForm()}
              >
                Save
              </LoadingButton>
            </Form>
          ) : (
            <p>Sign in to comment. </p>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
  function renderArticles() {
    return (
      <FadeIn>
        {/* <ButterToast /> */}
        <Row className="justify-content-md-center">
          {articles.map((article) =>
            ArticleCard(
              article,
              handleFavourite,
              showComments,
              isAuthenticated,
              favouriteArticles.includes(article._id)
            )
          )}
        </Row>
        <Row className="justify-content-md-center">
          <LoadingButton
            variant="outline-dark"
            isLoading={isLoading}
            type="submit"
            onClick={loadMore}
          >
            Load More
          </LoadingButton>
        </Row>
        {renderModal()}
      </FadeIn>
    );
  }
  return <Container>{renderArticles()}</Container>;
}
