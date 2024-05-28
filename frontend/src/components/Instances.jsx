import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const Instances = () => {
  const [searchText, setSearchText] = useState('');
  const [projectData, setProjectData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/sshData?find=${searchText}`);
      setProjectData(response.data);
      console.log(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleReset = () => {
    setSearchText('');
    fetchData();
  };

  const handleClick = async (e) => {
    try {
      const data = projectData[e.target.id];
      await fetch('http://localhost:8000/api/validatessh', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          awsAccessKey: data.awsAccessKey,
          awsSecretKey: data.awsSecretKey,
          sshUser: data.sshUser,
          region: data.region,
          sshIpAddress: data.sshIpAddress,
          sshKeyFilePath: data.sshKeyFilePath
        })
      });
    } catch (error) {
      console.log('Something went wrong check for the data', error);
      setError('Error fetching data');
    }
  };

  const handleScript = async (e) => {
    try {
      const data = projectData[e.target.id];
      await fetch('http://localhost:8000/api/synctotarget', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          awsAccessKey: data.awsAccessKey,
          awsSecretKey: data.awsSecretKey,
          sshUser: data.sshUser,
          region: data.region,
          sshIpAddress: data.sshIpAddress,
          sshKeyFilePath: data.sshKeyFilePath,
          targetSshUser: data.targetSshUser,
          targetAuthMethod: data.targetAuthMethod,
          targetSshPassword: data.targetSshPassword,
          targetSshPort: data.targetSshPort,
          targetIpAddress: data.targetIpAddress,
          targetSshKeyFilePath: data.targetSshKeyFilePath
        })
      });
    } catch (error) {
      console.log('Something went wrong check for the data', error);
      setError('Error fetching data');
    }
  };

  return (
    <div>
      <TextField
        label="Search by Project Name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch} disabled={loading}>
        Search
      </Button>
      <Button variant="contained" onClick={handleReset} disabled={loading}>
        Reset
      </Button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {projectData.length === 0 ? (
        <h1>Data not found</h1>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>SSH User</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>SSH Port</TableCell>
                <TableCell>SSH IP Address</TableCell>
                <TableCell>SSH Key File Path</TableCell>
                <TableCell>Target SSH User</TableCell>
                <TableCell>Target Auth Method</TableCell>
                <TableCell>Target SSH Port</TableCell>
                <TableCell>Target IP Address</TableCell>
                <TableCell>Target SSH Key File Path</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Output</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectData.map((project, idx) => (
                <TableRow key={project._id}>
                  <TableCell>{project._id}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.sshUser}</TableCell>
                  <TableCell>{project.region}</TableCell>
                  <TableCell>{project.sshPort}</TableCell>
                  <TableCell>{project.sshIpAddress}</TableCell>
                  <TableCell>{project.sshKeyFilePath}</TableCell>
                  <TableCell>{project.targetSshUser}</TableCell>
                  <TableCell>{project.targetAuthMethod}</TableCell>
                  <TableCell>{project.targetSshPort}</TableCell>
                  <TableCell>{project.targetIpAddress}</TableCell>
                  <TableCell>{project.targetSshKeyFilePath}</TableCell>
                  <TableCell>
                    <Button variant="contained" id={idx} onClick={handleClick}>Validate SSH</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" id={idx} onClick={handleScript}>Sync to Target</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Instances;
