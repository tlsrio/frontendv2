import { useParams } from "react-router-dom";
import Articles from "../Articles";

import axios from "axios";
axios.defaults.withCredentials = true;

export default function Category() {
  const { id } = useParams();
  return Articles({ category: id });
}
