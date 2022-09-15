import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

const port = 3005;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: { followedBy: true },
  });
  res.send(allUsers);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
