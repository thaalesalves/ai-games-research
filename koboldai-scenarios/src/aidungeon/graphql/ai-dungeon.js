module.exports = {
  query: `query ($username: String, $input: SearchInput) {
    user (username: $username) {
      id
      search(input: $input) {
        ...SearchFragment
      }
    }
  }`,
  scenarioVariables: (username, fromSaved) => {
    return {
      input: {
        saved: fromSaved,
        trash: false,
        contentType: "scenario",
        sortOrder: "createdAt",
        offset: 0
      },
      username: username
    }
  },
  storyVariables: (username, fromSaved) => {
    return {
      variables: {
        input: {
          saved: fromSaved,
          trash: false,
          contentType: "adventure",
          sortOrder: "createdAt",
          offset: 0
        },
        username: username
      }
    }
  },
  scenarioFragment: `
    fragment SearchFragment on Scenario {
      id
      publicId
      title
      description
      tags
      memory
      authorsNote
      prompt
      worldInfo
      options {
          id
          publicId
          title
          description
          tags
          memory
          authorsNote
          prompt
          worldInfo
          options {
              id
              publicId
              title
              description
              tags
              memory
              authorsNote
              prompt
              worldInfo
              options {
                  id
                  publicId
                  title
                  description
                  tags
                  memory
                  authorsNote
                  prompt
                  worldInfo
                  options {
                      id
                      publicId
                      title
                      description
                      tags
                      memory
                      authorsNote
                      prompt
                      worldInfo
                  }
              }
          }
      }
  }`,
  storyFragment: `
    fragment ContentCardSearchable on Adventure {
      id
      publicId
      userId
      title
      description
      tags
      memory
      authorsNote
      worldInfo
      actionCount
      actions {
          ...ActionSubscriptionAction
      }
      undoneWindow {
          ...ActionSubscriptionAction
      }
  }
  
  fragment ActionSubscriptionAction on Action {
    id
    text
    type
    adventureId
    decisionId
    undoneAt
  }`
};