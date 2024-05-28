const fs = require('fs');
const { spawn, exec } = require('child_process');
const orgument='-o StrictHostKeyChecking=no';
const {validateData} = require('./server')
const sshCommand = "timeout 35s ssh -o StrictHostKeyChecking=no -i uploads/sshKeyFile1716371449943.pem ec2-user@ec2-52-23-204-13.compute-1.amazonaws.com 'bash -s' < sourceAccount.bash AKIAU67MRTWZYPB7DV5M ZuSOGiHvGDLYS951oyIL7T65a0UZH6/SRFEg0D/z us-east-1;"


const sshUser = validateData.sshUser;
const sshKeyFilePath = 'uploads/sshKeyFile1716371449943.pem';
const sshIpAddress = validateData.sshIpAddress;
console.log(sshUser, sshIpAddress);
fs.chmodSync(sshKeyFilePath, '400');


console.log(validateData)
// const sshProcess = spawn('ssh', [orgument,'-i', sshKeyFilePath, `${sshUser}@${sshIpAddress}`, 'ls', '-lh'],'sudo -n bash -s < );

// const sshProcess = exec('ssh', [orgument,'-i', sshKeyFilePath, `${sshUser}@${sshIpAddress}`, 'sudo -n bash -s < usercreate.bash ']);


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



const port = 8081;

console.log(`Server running on port ${port}`);
