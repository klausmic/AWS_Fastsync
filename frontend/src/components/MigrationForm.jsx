import React, { useState } from 'react';
import axios from 'axios';
import './MigrationForm.css';
import { Link } from 'react-router-dom';

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
    authMethod: 'password',
    targetSshUser: '',
    targetAuthMethod: 'password',
    targetSshPassword: '',
    targetSshKeyFile: '',
    targetSshKeyFilePath: '',
    targetSshPort: '',
    targetIpAddress: '',
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
    
    console.log(formData);
    
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
      <h2>AWS Migration Validation Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Name: </label>
        <input type='text' name='projectName' value={formData.projectName} onChange={handleChange} />
        <br />
        <label>AWS Secret Key : </label>
        <input type='text' name='awsSecretKey' value={formData.awsSecretKey} onChange={handleChange} />
        <br />
        <label>AWS Access Key : </label>
        <input type='text' name='awsAccessKey' value={formData.awsAccessKey} onChange={handleChange} />
        <br />
        <label>Region : </label>
        <input type='text' name='region' value={formData.region} onChange={handleChange} />
        <br />
        <label>SSH User:</label>
        <input type="text" name="sshUser" value={formData.sshUser} onChange={handleChange} />
        <br />

        <label>Authentication Method:</label>
        <div>
          <input
            type="radio"
            id="password"
            name="authMethod"
            value="password"
            checked={formData.authMethod === 'password'}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="radio"
            id="keyFile"
            name="authMethod"
            value="keyFile"
            checked={formData.authMethod === 'keyFile'}
            onChange={handleChange}
          />
          <label htmlFor="keyFile">Key File</label>
        </div>
        <br />
        {formData.authMethod === 'password' ? (
          <>
            <label>Password:</label>
            <input type="password" name="sshPassword" value={formData.sshPassword} onChange={handleChange} />
          </>
        ) : (
          <>
            <label>SSH Key File:</label>
            <input type="file" name="sshKeyFile" onChange={handleFileChange} />
          </>
        )}
        <br />
        <label>SSH Port:</label>
        <input type="number" name="sshPort" value={formData.sshPort} onChange={handleChange} />
        <br />
        <label>SSH IP Address:</label>
        <input type="text" name="sshIpAddress" value={formData.sshIpAddress} onChange={handleChange} />
        <br />

        <h3>Target Account Details</h3>
        <label>Target SSH User:</label>
        <input type="text" name="targetSshUser" value={formData.targetSshUser} onChange={handleChange} />
        <br />
        <label>Target Authentication Method:</label>
        <div>
          <input
            type="radio"
            id="targetPassword"
            name="targetAuthMethod"
            value="password"
            checked={formData.targetAuthMethod === 'password'}
            onChange={handleChange}
          />
          <label htmlFor="targetPassword">Password</label>
          <input
            type="radio"
            id="targetKeyFile"
            name="targetAuthMethod"
            value="keyFile"
            checked={formData.targetAuthMethod === 'keyFile'}
            onChange={handleChange}
          />
          <label htmlFor="targetKeyFile">Key File</label>
        </div>
        <br />
        {formData.targetAuthMethod === 'password' ? (
          <>
            <label>Target Password:</label>
            <input type="password" name="targetSshPassword" value={formData.targetSshPassword} onChange={handleChange} />
          </>
        ) : (
          <>
            <label>Target SSH Key File:</label>
            <input type="file" name="targetSshKeyFile" onChange={handleFileChange} />
          </>
        )}
        <br />
        <label>Target SSH Port:</label>
        <input type="number" name="targetSshPort" value={formData.targetSshPort} onChange={handleChange} />
        <br />
        <label>Target SSH IP Address:</label>
        <input type="text" name="targetIpAddress" value={formData.targetIpAddress} onChange={handleChange} />
        <br />

        <button type="submit">Submit</button>
      </form>
      <Link to="/ssh"><button>Fetch SSH Data</button></Link>
    </div>
  );
};

export default MigrationForm;
