import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import { formatLink } from "../../libs/linkutils";
import Loading from "../../components/Loading";
import FadeIn from "../../components/Fade";
import axios from "axios";
axios.defaults.withCredentials = true;

var categoryList = [];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadCategories() {
    if (categoryList.length === 0) {
      try {
        const res = await axios(
          `/api/categories`
        );
        categoryList = res.data.categories;
      } catch (e) {
        console.log(e);
        alert(e);
      }
    }
    setCategories(categoryList);
    setIsLoading(false);
  }

  useEffect(() => {
    async function onLoad() {
      loadCategories();
    }
    onLoad();
  }, []);

  function listCategories() {
    return isLoading ? (
      Loading()
    ) : (
      <FadeIn>
        <ListGroup>
          {categories.map((category) => {
            return (
              <ListGroup.Item key={category}>
                <Link to={`/category/${formatLink(category)}`}>{category[0].toUpperCase() + category.substring(1) }</Link>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </FadeIn>
    );
  }
  return (
    <Container>
      <h1>Categories</h1>
      {listCategories()}
    </Container>
  );
}
