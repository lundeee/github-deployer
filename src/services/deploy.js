const config = require('../../config.js')
const { spawn } = require('child_process')

async function GetLogs() {
  const { spawn } = require('child_process');
  const child = spawn('../../scripts/test.sh');
  child.on('exit', function (code, signal) {
    if(code === 0) {
      console.log("success")
    } else {
      console.log('child process exited with ' +
      `code ${code} and signal ${signal}`);
    }

  });
  child.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
  });
}

async function Deploy(body) {
  console.log(`Updating ${body.repository.name} to commit: ${body.head_commit.message}`)
  const proj = config.projects.find(x => { return x.name === body.repository.name })
  if (proj) {
    const child = spawn("./scripts/" + proj.script);
    child.on('exit', function (code, signal) {
      if(code === 0) {
        console.log(`Success! Updating finished with code ${code} and signal ${signal}`)
      } else {
        console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
      }
        spawn(`pm2 restart ${body.repository.name}`);
    });
  }
}

module.exports.GetLogs = GetLogs;
module.exports.Deploy = Deploy;
