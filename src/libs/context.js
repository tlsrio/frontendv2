import { useContext, createContext } from "react";

export const AppContext = createContext(null);
export function useAppContext() {
  return useContext(AppContext); // react hook to access context
}


// import React, { createContext, useEffect, useState } from 'react'
// import axios from 'axios';

// export const myContext = createContext({});
// export default function Context(props) {

//     const [userObject, setUserObject] = useState<any>();

//     useEffect(() => {
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/getuser`, { withCredentials: true }).then((res) => {
//             console.log(res);
//             if (res.data) {
//                 setUserObject(res.data);
//             }
//         })
//     }, [])
//     return (
//         <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
//     )
// }