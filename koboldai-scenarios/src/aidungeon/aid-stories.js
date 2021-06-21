const fetch = require("node-fetch");
const rl = require('readline-sync');
const aid = require('./graphql/ai-dungeon.js');
const options = require('../app/options-graphql.js');

const execute = (username, userToken, fromSaved) => {
  fetch('https://api.aidungeon.io/graphql', {
    method: 'POST',
    headers: {
      'x-access-token': userToken,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `${aid.query}\n${aid.storyFragment}`,
      variables: aid.storyVariables(username, fromSaved)
    })
  })
  .then(res => res.json())
  .then(res => {
    options.execute(res, 'story');
  });
}

module.exports.execute = execute;