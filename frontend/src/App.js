

// import React from 'react';
// import MigrationForm from './components/MigrationForm';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import {Routes} from 'react-router-dom';
// import Instances from './components/Instances';


// export default function App(){
//   return(
//     <Router>
//     <div>
//     <Routes>
//       <Route path='/' Component={MigrationForm} />
//       <Route path='/ssh' Component={Instances} />
//     </Routes>
//     </div>
//     </Router>
//   )
// }

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import MigrationForm from "./components/MigrationForm";
import Instances from "./components/Instances";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-project" element={<MigrationForm />} />
        <Route path="/list-projects" element={<Instances />} />
      </Routes>
    </Router>
  );
};

export default App;
