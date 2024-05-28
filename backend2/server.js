const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { insertData, clientt } = require('./db');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 8000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(cors());

app.post('/api/migrationForm', upload.fields([{ name: 'sshKeyFile' }, { name: 'targetSshKeyFile' }]), async (req, res) => {
  const { 
    projectName, awsSecretKey, awsAccessKey, region, sshUser, sshPassword, sshPort, sshIpAddress,
    targetSshUser, targetAuthMethod, targetSshPassword, targetSshPort, targetIpAddress 
  } = req.body;
  
  const sshKeyFilePath = req.files['sshKeyFile'] ? req.files['sshKeyFile'][0].path.replace(/\\/g, '/') : '';
  const targetSshKeyFilePath = req.files['targetSshKeyFile'] ? req.files['targetSshKeyFile'][0].path.replace(/\\/g, '/') : '';

  const data = {
    projectName,
    awsSecretKey,
    awsAccessKey,
    region,
    sshUser,
    sshPassword,
    sshPort: parseInt(sshPort),
    sshIpAddress,
    sshKeyFilePath,
    targetSshUser,
    targetAuthMethod,
    targetSshPassword,
    targetSshPort: parseInt(targetSshPort),
    targetIpAddress,
    targetSshKeyFilePath
  };

  try {
    await insertData(data);
    console.log('Data inserted successfully');
    res.json({ success: true, message: 'Validation successful' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/sshData', (req, res) => {
  const command3 = req.query.find;
  const client = clientt;
  const dbName = 'fastsync';

  async function find_query(command3) {
    try {
      await client.connect();
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      const migration_form_data = db.collection('migration_form_data');
      const findResult = await migration_form_data.find({ projectName: command3 }).toArray();

      if (typeof findResult !== 'object') {
        res.status(500).json({ msg: "Something went wrong" });
        return;
      }
      console.log('Found documents =>', findResult);
      client.close();

      if (findResult.length > 0) {
        console.log(findResult);
        res.send(findResult);
      } else {
        console.log("No documents found");
        res.send("No documents found");
      }
    } catch (error) {
      console.error("Error Fetching data:", error);
      res.status(500).send("Error Fetching data");
    }
  }

  find_query(command3);
});

let validateData = {}

app.post('/api/validatessh', (req, res) => {
  validateData = req.body;
  console.log(validateData);

  const sshCommand = `timeout 35s ssh -o StrictHostKeyChecking=no -i ${validateData.sshKeyFilePath} ${validateData.sshUser}@${validateData.sshIpAddress} 'bash -s' < sourceAccount.bash ${validateData.awsAccessKey} ${validateData.awsSecretKey} ${validateData.region};`;
  fs.chmodSync(validateData.sshKeyFilePath, '400');

  try {
    const sshProcess = exec(sshCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`SSH command stderr: ${stderr}`);
        return;
      }
      console.log(`SSH command output: ${stdout}`);
    });

    sshProcess.stdout.on('data', (data) => {
      console.log(`output:\n${data}`);
    });

    sshProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    sshProcess.on('close', (code) => {
      console.log(`SSH command exited with code ${code}`);
    });
  } catch (err) {
    console.error('Some of the details are wrong:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/synctotarget', (req, res) => {
  validateData = req.body;
  console.log(validateData);

  const sshCommand = `timeout 35s ssh -o StrictHostKeyChecking=no -i ${validateData.targetSshKeyFilePath} ${validateData.targetSshUser}@${validateData.targetIpAddress} 'bash -s' < targetAccount.bash ${validateData.awsAccessKey} ${validateData.awsSecretKey} ${validateData.region};`;
  fs.chmodSync(validateData.targetSshKeyFilePath, '400');

  try {
    const sshProcess = exec(sshCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`SSH command stderr: ${stderr}`);
        return;
      }
      console.log(`SSH command output: ${stdout}`);
    });

    sshProcess.stdout.on('data', (data) => {
      console.log(`output:\n${data}`);
    });

    sshProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    sshProcess.on('close', (code) => {
      console.log(`SSH command exited with code ${code}`);
    });
  } catch (err) {
    console.error('Some of the details are wrong:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { validateData };
