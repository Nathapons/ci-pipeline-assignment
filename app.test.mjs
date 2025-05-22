import request from "supertest";
import app from "./app.mjs";
import { blogPosts } from "./db/index.mjs";

describe("GET /", () => {
  it("should return Hello TechUp!", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello World!");
  });
});

describe("GET /posts", () => {
  it("should return list of posts with pagination info", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("posts");
    expect(res.body).toHaveProperty("totalPosts");
  });

  it("should handle custom pagination parameters", async() => {
    const res = await request(app).get("/posts?page=2&limit=5");
    expect(res.statusCode).toBe(200);
    expect(res.body.limit).toBe(5);
    expect(res.body.posts.length).toBe(5);
    expect(res.body.currentPage).toBe(2);
  });

  it('should filter posts by category', async () => {
    const category = blogPosts[0].category;
    const res = await request(app).get(`/posts?category=${category}`);
    expect(res.statusCode).toBe(200);
    res.body.posts.forEach(post => {
      expect(post.category.toLowerCase()).toBe(category.toLowerCase());
    });
  });

  it('should filter posts by keyword', async () => {
    const keyword = blogPosts[0].title.split(' ')[0];
    const res = await request(app).get(`/posts?keyword=${keyword}`);
    expect(res.statusCode).toBe(200);
    res.body.posts.forEach(post => {
      const containsKeyword = 
          post.title.toLowerCase().includes(keyword.toLowerCase()) ||
          post.description.toLowerCase().includes(keyword.toLowerCase()) ||
          post.content.toLowerCase().includes(keyword.toLowerCase()) ||
          post.category.toLowerCase().includes(keyword.toLowerCase());
      expect(containsKeyword).toBe(true);
    });
  });

  it('should handle invalid pagination parameters gracefully', async () => {
    const response = await request(app).get('/posts?page=-1&limit=0');
    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.limit).toBe(6);
  });

  it('should limit maximum posts per page to 100', async () => {
    const response = await request(app).get('/posts?limit=200');
    expect(response.status).toBe(200);
    expect(response.body.limit).toBe(100);
  });
  
  it('should handle errors and return error message', async () => {
    // Mock implementation to force an error
    const originalFilter = Array.prototype.filter;
    Array.prototype.filter = function() { throw new Error('Test error'); };
    
    const res = await request(app).get('/posts?category=test');
    expect(res.body).toHaveProperty('message', 'Test error');
    
    // Restore original implementation
    Array.prototype.filter = originalFilter;
  });
});

describe("GET /posts/:id", () => {
  it("should return a post if it exists", async () => {
    const res = await request(app).get("/posts/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("should return 404 if post does not exist", async () => {
    const res = await request(app).get("/posts/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Blog post not found");
  });
});
