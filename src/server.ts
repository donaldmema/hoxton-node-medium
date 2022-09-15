import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

const port = 3005;

app.use(cors());
app.use(express.json());

// Get user by id
app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { followedBy: true },
  });
  res.send(user);
});

// Get all users along with their followers and following
app.get("/users", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: { followedBy: true, following: true },
  });
  res.send(allUsers);
});

app.post("/users", async (req, res) => {
  const newUser = await prisma.user.create({
    data: req.body,
  });
  res.send(newUser);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: { id: Number(id) },
  });
  res.send(user);
});

//Gets all posts along with their author information
app.get("/posts", async (req, res) => {
  const allPosts = await prisma.post.findMany({
    include: { author: true },
  });
  res.send(allPosts);
});

//Gets a single post along with its author information
app.get("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });
  res.send(post);
});

//Gets all posts by a specific user
app.get("/users/:id/posts", async (req, res) => {
  const id = Number(req.params.id);
  const posts = await prisma.post.findMany({
    where: { authorId: id },
    include: { author: true },
  });
  res.send(posts);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
