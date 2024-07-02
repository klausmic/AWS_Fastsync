import React, { useState } from 'react';
import axios from 'axios';
import './MigrationForm.css';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const MigrationForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    awsAccessKey: '',
    awsSecretKey: '',
    region: '',
    sshUser: '',
    sshPassword: '',
    sshPort: '',
    sshIpAddress: '',
    sshKeyFile: '',
    sshKeyFilePath: '',
    sourcDirectoryPath: '',
    authMethod: 'password',
    targetSshUser: '',
    targetAuthMethod: 'password',
    targetSshPassword: '',
    targetSshKeyFile: '',
    targetSshKeyFilePath: '',
    targetSshPort: '',
    targetIpAddress: '',
    targetDirectoryPath: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'authMethod') {
      setFormData({
        ...formData,
        authMethod: value,
        sshPassword: '',
        sshKeyFile: null,
      });
    }

    if (name === 'targetAuthMethod') {
      setFormData({
        ...formData,
        targetAuthMethod: value,
        targetSshPassword: '',
        targetSshKeyFile: null,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const filePath = files[0] ? files[0].name : '';
    setFormData({
      ...formData,
      [name]: files[0],
      [`${name}Path`]: filePath,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const instance = axios.create({
      baseURL: 'http://localhost:8000',
    });

    instance.post('/api/migrationForm', formDataToSend)
      .then(response => {
        console.log('Response:', response.data);
        alert('Form submitted successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2>FastSync Form</h2>
      <form onSubmit={handleSubmit}>
        <TextField label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="AWS Access Key" name="awsAccessKey" value={formData.awsAccessKey} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="AWS Secret Key" name="awsSecretKey" value={formData.awsSecretKey} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Region" name="region" value={formData.region} onChange={handleChange} fullWidth margin="normal" />

        <h3>Source Instance Details</h3>
        <TextField label="SSH User" name="sshUser" value={formData.sshUser} onChange={handleChange} fullWidth margin="normal" />

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Authentication Method</FormLabel>
          <RadioGroup row name="authMethod" value={formData.authMethod} onChange={handleChange}>
            <FormControlLabel value="password" control={<Radio />} label="Password" />
            <FormControlLabel value="keyFile" control={<Radio />} label="Key File" />
          </RadioGroup>
        </FormControl>
        {formData.authMethod === 'password' ? (
          <TextField label="Password" type="password" name="sshPassword" value={formData.sshPassword} onChange={handleChange} fullWidth margin="normal" />
        ) : (
          <div>
            <Button variant="contained" component="label" margin="normal">
              Upload Key File
              <input type="file" hidden name="sshKeyFile" onChange={handleFileChange} />
            </Button>
            <TextField label="Key File Path" name="sshKeyFilePath" value={formData.sshKeyFilePath} fullWidth margin="normal" disabled />
          </div>
        )}

        <TextField label="SSH Port" name="sshPort" value={formData.sshPort} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="SSH IP Address" name="sshIpAddress" value={formData.sshIpAddress} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Source Directory path to Sync" name="sourcDirectoryPath" value={formData.sourcDirectoryPath} onChange={handleChange} fullWidth margin="normal" />
        

        <h3>Target Instance Details</h3>
        <TextField label="Target SSH User" name="targetSshUser" value={formData.targetSshUser} onChange={handleChange} fullWidth margin="normal" />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Target Authentication Method</FormLabel>
          <RadioGroup row name="targetAuthMethod" value={formData.targetAuthMethod} onChange={handleChange}>
            <FormControlLabel value="password" control={<Radio />} label="Password" />
            <FormControlLabel value="keyFile" control={<Radio />} label="Key File" />
          </RadioGroup>
        </FormControl>
        {formData.targetAuthMethod === 'password' ? (
          <TextField label="Target SSH Password" type="password" name="targetSshPassword" value={formData.targetSshPassword} onChange={handleChange} fullWidth margin="normal" />
        ) : (
          <div>
            <Button variant="contained" component="label" margin="normal">
              Upload Target Key File
              <input type="file" hidden name="targetSshKeyFile" onChange={handleFileChange} />
            </Button>
            <TextField label="Target Key File Path" name="targetSshKeyFilePath" value={formData.targetSshKeyFilePath} fullWidth margin="normal" disabled />
          </div>
        )}

        <TextField label="Target SSH Port" name="targetSshPort" value={formData.targetSshPort} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Target IP Address" name="targetIpAddress" value={formData.targetIpAddress} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Target Directory to Sync" name="targetDirectoryPath" value={formData.targetDirectoryPath} onChange={handleChange} fullWidth margin="normal" />

        <Button variant="contained" color="primary" type="submit" fullWidth margin="normal">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default MigrationForm;
