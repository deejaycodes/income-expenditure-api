import { User } from "../database/entities/User";

const user1: User = {
  userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  email: "user1@example.com",
  statements: []
};

const user2: User = {
  userId: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
  email: "user2@example.com",
  statements: []
};

const user3: User = {
  userId: "c3d4e5f6-a7b8-9012-cdef-234567890abc",
  email: "user3@example.com",
  statements: []
};

export { user1, user2, user3 };
