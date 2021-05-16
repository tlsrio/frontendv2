import React, { useRef, useEffect, useState } from "react";
import { Card, Badge, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const MAX_POSSIBLE_HEIGHT = 500;

export default function ArticleCard(
  article,
  handleFavourite,
  showComments,
  isAuthenticated,
  favourited
) {
  const styles = {
    card: {
      margin: "10px",
      width: "350px",
      textDecoration: "none",
      color: "black",
    },
  };

  const ExpendableText = ({ maxHeight }) => {
    const ref = useRef();
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
      if (ref.current.scrollHeight > maxHeight) {
        setExpanded(false);
      }
    }, [maxHeight]);
    return (
      <Card.Body
        style={styles.cardText}
        ref={ref}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          style={{
            maxHeight: expanded ? MAX_POSSIBLE_HEIGHT : maxHeight,
            overflow: "hidden",
            transition: "max-height 0.2s ease",
          }}
        >
          <Card.Title>{article.title}</Card.Title>
          <Card.Text>{article.source}</Card.Text>
          <Card.Text>{article.summary}</Card.Text>
        </div>
        <div>
          <p style={{ textDecoration: "underline" }}>
            {expanded ? "- Show Less" : "+ Show More"}
          </p>
        </div>
      </Card.Body>
    );
  };

  // TODO: why is article._id duplicate? need to remove math.random
  return (
    <Card style={styles.card} key={article._id + Math.random()}>
      <Card.Img
        variant="top"
        src={article.picture}
        style={{ width: "350px", height: "275px" }}
      />
      <Card.Body>
        {article.categories.map((category) => {
          return (
            <React.Fragment key={category}>
              <Badge variant="dark" as={Link} to={`/category/${category}`}>
                {category}
              </Badge>
            </React.Fragment>
          );
        })}

        <ExpendableText maxHeight={175} />
      </Card.Body>
      <Card.Footer>
        {favourited ? (
          <Button
            variant="outline-dark"
            onClick={() => handleFavourite(article._id)}
            disabled={!isAuthenticated}
          >
            Unfavourite
          </Button>
        ) : (
          <Button
            variant="outline-dark"
            onClick={() => handleFavourite(article._id)}
            disabled={!isAuthenticated}
          >
            Favourite
          </Button>
        )}{" "}
        <Button variant="outline-dark" onClick={() => showComments(article)}>
          Comments
        </Button>
      </Card.Footer>
    </Card>
  );
}
