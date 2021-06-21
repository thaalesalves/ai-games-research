const fetch = require("node-fetch");
const rl = require('readline-sync');
const aid = require('./graphql/ai-dungeon.js');
const options = require('../app/options-graphql.js');

const execute = (userToken) => {
  const username = rl.question("Type your AI Dungeon username: ");
  fetch('https://api.aidungeon.io/graphql', {
    method: 'POST',
    headers: {
      'x-access-token': userToken,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `${aid.query}\n${aid.scenarioFragment}`,
      variables: aid.scenarioVariables(username)
    })
  })
  .then(res => res.json())
  .then(res => {
    options.execute(res, 'scenario');
  });
}

module.exports.execute = execute;