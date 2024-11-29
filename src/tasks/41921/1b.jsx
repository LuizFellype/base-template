import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const initialUsers = [
  { id: 1, name: "Alice", posts: [] },
  { id: 2, name: "Bob", posts: [] },
];

const Post = ({ post, onLike, onDislike, onShare, isShared }) => {
  return (
    <Card className={`mb-4 ${isShared ? "border-l-4 border-black" : ""}`}>
      <CardHeader>
        <CardTitle>{post.userName}</CardTitle>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button onClick={() => onLike(post.id)} className="mr-2">
            Like ({post.likes})
          </Button>
          <Button onClick={() => onDislike(post.id)} className="mr-2">
            Dislike ({post.dislikes})
          </Button>
        </div>
        <Button onClick={() => onShare(post)}>Share ({post.shared})</Button>
      </CardFooter>
    </Card>
  );
};

const Feed = ({ currentUser, users, setPosts, setCurrentPage }) => {
  const [newPostContent, setNewPostContent] = useState("");

  const handlePublish = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: Date.now(),
        userName: currentUser.name,
        content: newPostContent,
        likes: 0,
        dislikes: 0,
        shared: 0,
      };
      setPosts(currentUser.id, [...currentUser.posts, newPost]);
      setNewPostContent("");
    }
  };

  const handleLike = (postId) => {
    setPosts(
      currentUser.id,
      currentUser.posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (postId) => {
    setPosts(
      currentUser.id,
      currentUser.posts.map((post) =>
        post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  const handleShare = (post) => {
    const sharedPost = {
      ...post,
      id: Date.now(),
      shared: post.shared + 1,
      isShared: true,
    };
    setPosts(currentUser.id, [...currentUser.posts, sharedPost]);
    setPosts(
      post.userName === currentUser.name ? currentUser.id : users.find((u) => u.name === post.userName).id,
      users
        .find((u) => u.name === post.userName)
        .posts.map((p) => (p.id === post.id ? { ...p, shared: p.shared + 1 } : p))
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <Button onClick={() => setCurrentPage("profile")} variant="link">
          {currentUser.name}'s Feed
        </Button>
      </h1>
      <Textarea
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder="What's on your mind?"
        className="mb-4"
      />
      <Button onClick={handlePublish} className="mb-4">
        Publish
      </Button>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Posts</TabsTrigger>
          <TabsTrigger value="friends">Friend's Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          {currentUser.posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              isShared={post.isShared}
            />
          ))}
        </TabsContent>
        <TabsContent value="friends">
          {users
            .filter((user) => user.id !== currentUser.id)
            .flatMap((user) => user.posts)
            .map((post) => (
              <Post
                key={post.id}
                post={post}
                onLike={handleLike}
                onDislike={handleDislike}
                onShare={handleShare}
                isShared={false}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Profile = ({ currentUser, setCurrentPage }) => {
  const totalLikes = currentUser.posts.reduce((sum, post) => sum + post.likes, 0);
  const totalSharedPosts = currentUser.posts.filter((post) => post.isShared).length;
  const totalPersonalPostsShared = currentUser.posts.reduce((sum, post) => sum + post.shared, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{currentUser.name}'s Profile</h1>
      <Card className="mb-4">
        <CardContent>
          <p>Total Likes: {totalLikes}</p>
          <p>Total Personal Posts Shared: {totalPersonalPostsShared}</p>
          <p>Total Shared Posts: {totalSharedPosts}</p>
        </CardContent>
      </Card>
      <Button onClick={() => setCurrentPage("feed")}>Home</Button>
    </div>
  );
};

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUserId, setCurrentUserId] = useState(1);
  const [currentPage, setCurrentPage] = useState("feed");

  const currentUser = users.find((user) => user.id === currentUserId);

  const setPosts = (userId, newPosts) => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, posts: newPosts } : user))
    );
  };

  const switchUser = () => {
    setCurrentUserId(currentUserId === 1 ? 2 : 1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button onClick={switchUser} className="mt-4 ml-4">
        Switch User
      </Button>
      {currentPage === "feed" ? (
        <Feed
          currentUser={currentUser}
          users={users}
          setPosts={setPosts}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <Profile currentUser={currentUser} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}