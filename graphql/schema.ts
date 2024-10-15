export const typeDefs = `#graphql
type Photo {
  id: ID!
  image: String
  title: String!
  createdAt: String!
  updatedAt: String!
  owner: User  
}
type User {
  id: ID!
  name: String!
  photos: [Photo!]!
}
type Query {
  aImg: [Photo]  
  allImg: [Photo]
}
type Mutation {
  signup(name: String!): String!
  login(name: String!): String!
  addPhoto(image: String!, title: String! ): String!
  changeTitle(id: ID!, title: String!): String!
  deletePhoto(id: ID!): String!
}
`;