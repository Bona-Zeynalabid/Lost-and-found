"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store"; // <-- import global store

export default function CommunityPage() {
  const router = useRouter();
  const user = useStore((s) => s.user); // logged-in user from store

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Replies state – keyed by post ID
  const [repliesMap, setRepliesMap] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});

  // Fetch all posts on mount
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/community/posts", {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load posts");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Publish a new post
  const handlePublish = async () => {
    if (!newPostContent.trim()) return;
    setPublishing(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newPostContent.trim() }),
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publishing failed");
      setPosts((prev) => [data, ...prev]);
      setNewPostContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  // Delete a post (owner only)
  const handleDeletePost = async (postId) => {
    if (!confirm("Delete this post and all its replies?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/community/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      if (!res.ok) throw new Error("Delete failed");
      // Remove post from state
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      // Remove replies from map
      setRepliesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[postId];
        return newMap;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete a reply (owner only)
  const handleDeleteReply = async (replyId, postId) => {
    if (!confirm("Delete this reply?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/community/replies/${replyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      if (!res.ok) throw new Error("Delete failed");
      // Remove reply from local state
      setRepliesMap((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((r) => r._id !== replyId) || [],
      }));
      // Optionally decrease reply count on the post
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, replyCount: (p.replyCount || 1) - 1 } : p
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Like / unlike a post
  const handleLikePost = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/posts/${postId}/like`,
        { method: "POST", credentials: "include" }
      );
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Like failed");
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likesCount: data.likesCount, liked: data.liked }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch replies for a post
  const fetchReplies = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/posts/${postId}/replies`,
        { credentials: "include" }
      );
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load replies");
      setRepliesMap((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle reply section for a post
  const toggleReplies = (postId) => {
    if (expandedReplies[postId]) {
      setExpandedReplies((prev) => ({ ...prev, [postId]: false }));
    } else {
      setExpandedReplies((prev) => ({ ...prev, [postId]: true }));
      if (!repliesMap[postId]) fetchReplies(postId);
    }
  };

  // Like / unlike a reply
  const handleLikeReply = async (replyId, postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/replies/${replyId}/like`,
        { method: "POST", credentials: "include" }
      );
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Like failed");
      setRepliesMap((prev) => {
        const replies = [...(prev[postId] || [])];
        const index = replies.findIndex((r) => r._id === replyId);
        if (index !== -1) {
          replies[index] = {
            ...replies[index],
            likesCount: data.likesCount,
            liked: data.liked,
          };
        }
        return { ...prev, [postId]: replies };
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Submit a reply
  const submitReply = async (postId) => {
    const content = replyInputs[postId]?.trim();
    if (!content) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/posts/${postId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reply failed");
      setRepliesMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));
      setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
      // Increase reply count on the post
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, replyCount: (p.replyCount || 0) + 1 } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Format date for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Helper to check ownership
  const isOwner = (item) => {
    if (!user) return false;
    return item.user?._id === user._id;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Civic Forum & Notices
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Community bulletin board for general inquiries and notices.
        </p>
      </section>

      {/* New Post Input */}
      <div className="glass-panel p-4 rounded-xs space-y-3">
        <textarea
          rows={3}
          placeholder="Post a general community inquiry..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
          maxLength={1000}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--text-secondary)]">
            {newPostContent.length}/1000
          </span>
          <button
            onClick={handlePublish}
            disabled={publishing || !newPostContent.trim()}
            className="px-4 py-2 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Publish Entry"}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-2 mt-2">
            {error}
          </p>
        )}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          Loading notices…
        </p>
      ) : posts.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
          No community posts yet. Be the first to share.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post._id}
              className="glass-panel p-4 rounded-xs border-b border-[var(--border-color)]"
            >
              <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                <span className="font-semibold text-[var(--text-primary)]">
                  {post.user?.firstName
                    ? `${post.user.firstName} ${post.user.lastName || ""}`
                    : "Unknown Member"}
                </span>
                <span>{formatTime(post.createdAt)}</span>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Actions: Like, Reply, Delete (if owner) */}
              <div className="flex items-center space-x-4 mt-2 text-[10px] uppercase tracking-wider">
                <button
                  onClick={() => handleLikePost(post._id)}
                  className="hover:text-[var(--accent-gold)] transition-colors"
                >
                  {post.liked ? "❤️" : "♡"} {post.likesCount || 0} Likes
                </button>
                <button
                  onClick={() => toggleReplies(post._id)}
                  className="hover:text-[var(--accent-gold)] transition-colors"
                >
                  {expandedReplies[post._id] ? "Hide Replies" : "Replies"}{" "}
                  ({post.replyCount || 0})
                </button>
                {isOwner(post) && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="hover:text-red-500 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Replies section */}
              {expandedReplies[post._id] && (
                <div className="mt-3 pl-4 border-l border-[var(--border-color)] space-y-3">
                  {repliesMap[post._id]?.length > 0 ? (
                    repliesMap[post._id].map((reply) => (
                      <div key={reply._id} className="text-xs">
                        <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                          <span className="font-semibold">
                            {reply.user?.firstName
                              ? `${reply.user.firstName} ${reply.user.lastName || ""}`
                              : "Unknown"}
                          </span>
                          <span>{formatTime(reply.createdAt)}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{reply.content}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <button
                            onClick={() => handleLikeReply(reply._id, post._id)}
                            className="text-[10px] uppercase tracking-wider hover:text-[var(--accent-gold)] transition-colors"
                          >
                            {reply.liked ? "❤️" : "♡"} {reply.likesCount || 0} Likes
                          </button>
                          {isOwner(reply) && (
                            <button
                              onClick={() => handleDeleteReply(reply._id, post._id)}
                              className="text-[10px] uppercase tracking-wider hover:text-red-500 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      No replies yet.
                    </p>
                  )}

                  {/* Reply input */}
                  <div className="flex space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyInputs[post._id] || ""}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border border-[var(--border-color)] p-1.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                      maxLength={500}
                    />
                    <button
                      onClick={() => submitReply(post._id)}
                      disabled={!replyInputs[post._id]?.trim()}
                      className="px-3 py-1.5 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}