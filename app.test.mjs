import request from "supertest";
import app from "./app.mjs";
import { blogPosts } from "./db/index.mjs";


describe("GET /", () => {
  it("should return query params", async () => {
    const name = "John";
    const age = 30;
    const res = await request(app).get(`/?name=${name}&age=${age}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name, age: age.toString()});
  });
});

describe("GET /posts", () => {
  it("should return list of posts with pagination info", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("posts");
    expect(res.body).toHaveProperty("totalPosts");
  });

  it("should return a specific post when valid id is provided", async () => {
    const testPost = blogPosts[0];
    const res = await request(app).get(`/posts?id=${testPost.id}`);
    expect(res.statusCode).toBe(200);
    
    // Create a copy of testPost with date as string for comparison
    const expectedPost = { ...testPost, date: testPost.date.toISOString() };
    expect(res.body).toEqual(expectedPost);
  });

  it("should return 404 when post id does not exist", async () => {
    const id = 999;
    const res = await request(app).get(`/posts?id=${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Blog post not found");
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

  it('should filter posts by keyword title', async () => {
    const keyword = blogPosts[0].title;
    const keywordLower = keyword.toLowerCase();
    const res = await request(app).get(`/posts?keyword=${keyword}`);
    expect(res.statusCode).toBe(200);
    res.body.posts.forEach(post => {
      const containsKeyword = (post.title + ' ' + post.description + ' ' + 
                          post.content + ' ' + post.category).toLowerCase();
      expect(containsKeyword.includes(keywordLower)).toBe(true);
    });
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
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'An internal server error occurred');
    
    // Restore original implementation
    Array.prototype.filter = originalFilter;
  });
});
