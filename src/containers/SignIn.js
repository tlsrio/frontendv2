// import React, { useState } from "react";
// import { Container, Form, FormControl, Col, Card, Button } from "react-bootstrap";
// import LoadingButton from "../components/LoadingButton";
// import { useHistory } from "react-router-dom";
// import { useFields } from "../libs/hooks";
// import { useAppContext } from "../libs/context";
// import axios from "axios";
// import Fade from "react-reveal/Fade";

// // axios.defaults.withCredentials = true;

// export default function Login() {
//   console.log("url:", `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`);
//   const { userHasAuthenticated, setUsername, setUserId } = useAppContext();

//   const [isLoading, setIsLoading] = useState(false);
//   const history = useHistory();
//   var [fields, handleFieldChange] = useFields({
//     username: "",
//     password: "",
//   });

//   function validateForm() {
//     return fields.username.length > 0 && fields.password.length > 0;
//   }
//   async function handleSubmit(event) {
//     event.preventDefault();
//     const user = {
//       username: fields.username,
//       password: fields.password,
//     };
//     try {
//       // const res = await axios.post(
//       //   `
//       // ${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`,
//       //   user,
//       //   { withCredentials: true }
//       // );

//       const res = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/auth/login/success`,
//         { withCredentials: true }
//       );
//       console.log(res.data);
//       userHasAuthenticated(true);
//       setUsername(res.data.username);
//       setUserId(res.data.userId);
//       setIsLoading(false);
//       history.push("/");
//     } catch (e) {
//       alert(e);
//       console.error(e);
//       setIsLoading(false);
//     }
//   }
//   const googleLogin = () => {
//     window.open( `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`, "_self");
//   }

//   return (
//     <Container style={{ position: "absolute", top: "30%" }}>
//       <Fade>
//         <Card>
//           <Card.Header>
//             <h1>Sign In</h1>
//           </Card.Header>
//           <Card.Body>
//             <Form onSubmit={handleSubmit}>
//               <Form.Row>
//                 <Form.Group as={Col}>
//                   <Form.Label>Username</Form.Label>
//                   <FormControl
//                     id="username"
//                     autoFocus
//                     value={fields.username}
//                     onChange={handleFieldChange}
//                   />
//                 </Form.Group>
//                 <Form.Group as={Col}>
//                   <Form.Label>Password</Form.Label>
//                   <FormControl
//                     id="password"
//                     type="password"
//                     value={fields.password}
//                     onChange={handleFieldChange}
//                   />
//                 </Form.Group>
//               </Form.Row>
//               <LoadingButton
//                 isLoading={isLoading}
//                 type="submit"
//                 disabled={!validateForm()}
//               >
//                 Sign In
//               </LoadingButton>

//             </Form>
//             <Button
//                 onClick={googleLogin}
//               >
//                 Login with Google
//               </Button>
//           </Card.Body>
//         </Card>
//       </Fade>
//     </Container>
//   );
// }
