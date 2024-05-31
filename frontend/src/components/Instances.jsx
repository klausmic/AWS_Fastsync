import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const Instances = () => {
  const [searchText, setSearchText] = useState('');
  const [projectData, setProjectData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        setLogs((prevLogs) => prevLogs + data.message + '\n');
      } else if (data.type === 'status') {
        setStatus(data.status === 'success' ? 'Successful' : 'Failed');
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        setLogs((prevLogs) => prevLogs + data.message + '\n');
      } else if (data.type === 'status') {
        setStatus(data.status === 'success' ? 'Successful' : 'Failed');
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

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

  const handleAction = async (e) => {
    try {
      setLogs('');
      setStatus('');
      const data = projectData[e.target.id];
      await fetch('http://localhost:8000/api/performActions', {
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
          sourcDirectoryPath: data.sourcDirectoryPath,
          targetSshUser: data.targetSshUser,
          targetAuthMethod: data.targetAuthMethod,
          targetSshPassword: data.targetSshPassword,
          targetSshPort: data.targetSshPort,
          targetIpAddress: data.targetIpAddress,
          targetSshKeyFilePath: data.targetSshKeyFilePath,
          targetDirectoryPath: data.targetDirectoryPath

        })
      });
    } catch (error) {
      console.log('Something went wrong check for the data', error);
      setError('Error performing actions');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search by Project Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading} style={{ marginRight: '10px' }}>
          Search
        </Button>
        <Button variant="contained" onClick={handleReset} disabled={loading}>
          Reset
        </Button>
      </div>

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
                    <Button variant="contained" id={idx} onClick={handleAction}>SYNC</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h2>Logs</h2>
        <pre style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>{logs}</pre>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Status</h2>
        <p>Status: <span style={{ color: status === 'Successful' ? 'green' : 'red' }}>{status}</span></p>
      </div>
    </div>
  );
};

export default Instances;
