module.exports = {
  query: `query ($username: String, $input: SearchInput) {
    user (username: $username) {
      id
      search(input: $input) {
        ...SearchFragment
      }
    }
  }`,
  scenarioVariables: (username) => {
    return {
      input: {
        saved: false,
        trash: false,
        contentType: "scenario",
        sortOrder: "createdAt",
        offset: 0
      },
      username: username
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
  }`
};