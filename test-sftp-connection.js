// test-sftp-connection.js
"use strict";

async function testConnection() {
  const Client = require("ssh2-sftp-client");

  const config = {
    host: "140.118.201.159",
    username: "lkc_admin",
    password: "ProfChouLKC#81",
    port: 24,
    // debug: console.log,
  };

  const sftp = new Client("example-client");

  sftp
    .connect(config)
    .then(() => {
      return sftp.cwd();
    })
    .then((p) => {
      console.log(`Remote working directory is ${p}`);
      return sftp.end();
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`); // error message will include 'example-client'
    });
}

testConnection();
