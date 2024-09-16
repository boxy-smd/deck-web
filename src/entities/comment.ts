export interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: {
    name: string
    username: string
    profileUrl: string
  }
  authorId: string
}
