import express from "express";
import cors from "cors";
import { blogPosts } from "./db/index.mjs";

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get("/", (req, res) => {
  const query = req.query;
  res.status(200).json(query);
});

app.get("/posts", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const category = req.query.category || "";
    const keyword = req.query.keyword || "";
    const id = req.query.id || "";

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));

    if (id) {
      const post = blogPosts.find((post) => post.id === Number(id));
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      return res.status(200).json(post);
    }

    let filteredPosts = blogPosts;
    if (category) {
      filteredPosts = blogPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        const searchText = (post.title + ' ' + post.description + ' ' + 
                          post.content + ' ' + post.category).toLowerCase();
        return searchText.includes(keywordLower);
      });
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

export default app;
