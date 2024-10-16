import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    register(name: String!, username: String!, password: String!): User!
    login(username: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
  }
`;

export default typeDefs;
