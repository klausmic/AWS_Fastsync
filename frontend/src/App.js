// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';
// function App() {
//   const [accessKey, setAccessKey] = useState('');
//   const [secretKey, setSecretKey] = useState('');
//   const [fileDirectory, setFileDirectory] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleValidation = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.post('/api/validate-ssh', {
//         accessKey,
//         secretKey,
//         fileDirectory
//       });
//       console.log(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error:', error);
//       setError('An error occurred. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>AWS Migration Validation</h2>
//       <div className="form">
//         <input
//           type="text"
//           placeholder="Access Key"
//           value={accessKey}
//           onChange={(e) => setAccessKey(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Secret Key"
//           value={secretKey}
//           onChange={(e) => setSecretKey(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="File Directory"
//           value={fileDirectory}
//           onChange={(e) => setFileDirectory(e.target.value)}
//         />
//         <button className="submit-btn" onClick={handleValidation} disabled={loading}>
//           {loading ? 'Loading...' : 'Validate SSH'}
//         </button>
//         {error && <p className="error-message">{error}</p>}
    
        
//       </div>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import MigrationForm from './components/MigrationForm';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Routes} from 'react-router-dom';
import Instances from './components/Instances';


export default function App(){
  return(
    <Router>
    <div>
    <Routes>
      <Route path='/' Component={MigrationForm} />
      <Route path='/ssh' Component={Instances} />
    </Routes>
    </div>
    </Router>
  )
}