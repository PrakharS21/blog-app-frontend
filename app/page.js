"use client"; // Next.js App Router ke liye

import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch all posts from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  // Add Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      setPosts([...posts, data]); 
      setNewPost({ title: "", content: "" }); 
    } catch (err) {
      console.error("Error adding post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Post
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
      });

      // remove deleted post from UI
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading posts...</h2>;
  }

  return (
    <main
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Welcome to Blogify 📝
      </h1>

      {/* Add Post Section */}
      <section
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#333" }}>✍️ Add a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
          <textarea
            placeholder="Write your content here..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              resize: "vertical",
            }}
            required
          ></textarea>
         <button
  type="submit"
  disabled={submitting}
  style={{
    padding: "5px 13px",
    background: submitting ? "#aaa" : "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: submitting ? "not-allowed" : "pointer",
    fontSize: "16px",
    transition: "0.3s ease",
  }}
>
  {submitting ? (
    "Adding..."
  ) : (
    <span style={{display:"flex", alignItems:"center",gap:"5px"}}>
      <h2 style={{ color: "lightgreen", fontWeight: "bold",fontSize:"28px" }}>+</h2> Add Post
    </span>
  )}
</button>

        </form>
      </section>

      {/* Blog List */}
      <section>
        <h2 style={{ marginBottom: "15px" }}>📌 Recent Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                margin: "10px 0",
                padding: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                background: "#fff",
                position: "relative",
              }}
            >
              <h3 style={{ margin: "0 0 10px" }}>{post.title}</h3>
              <p style={{ color: "#555" }}>{post.content}</p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#ff4d4f",
                  border: "none",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ❌ Delete
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
