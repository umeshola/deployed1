import { gql } from "@apollo/client";

export const ALL_PHOTO = gql`
query Query {
  allImg {
    image
    id
    title
    owner {
      name
      id
    }
  }
}
`

export const A_PHOTO = gql`
query Query {
  aImg {
    id
    image
    title
  }
}
`

export const SINGUP = gql`
mutation Mutation($name: String!) {
  signup(name: $name)
}
`

export const LOGIN = gql`
mutation Mutation($name: String!) {
  login(name: $name)
}
`
export const ADD_PHOTO = gql`
mutation Mutation($image: String!, $title: String!) {
  addPhoto(image: $image, title: $title)
}
`

export const CHANGE_TITLE = gql`
mutation Mutation($changeTitleId: ID!, $title: String!) {
  changeTitle(id: $changeTitleId, title: $title)
}
`
export const DELETE_PHOTO = gql`
mutation Mutation($deletePhotoId: ID!) {
  deletePhoto(id: $deletePhotoId)
}
`