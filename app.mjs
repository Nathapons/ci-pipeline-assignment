import express from "express";
import cors from "cors";
import { blogPosts } from "./db/index.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({
     origin: ['https://yourdomain.com', 'https://anotherdomain.com'],
     methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '1mb' }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/posts", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const category = req.query.category || "";
    const keyword = req.query.keyword || "";

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));

    let filteredPosts = blogPosts;
    if (category) {
      filteredPosts = blogPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      filteredPosts = filteredPosts.filter(
        (post) => regex.test(post.title) ||
         regex.test(post.description) ||
         regex.test(post.content) ||
         regex.test(post.category)
      );
    }

    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;

    const results = {
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
      posts: filteredPosts.slice(startIndex, endIndex),
    };

    if (endIndex < filteredPosts.length) {
      results.nextPage = safePage + 1;
    }

    if (startIndex > 0) {
      results.previousPage = safePage - 1;
    }

    return res.json(results);
  } catch (e) {
     return res.status(500).json({
       message: "An internal server error occurred"
     });
  }
});

app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const post = blogPosts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).json({ error: "Blog post not found" });
  }

  res.json(post);
});

export default app;
