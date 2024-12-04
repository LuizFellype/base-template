import React, { useState } from "react";
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
    <Card dir="ltr" className={`mb-4 ${isShared ? "border-l-4 border-black" : ""}`}>
      <CardHeader>
        <CardTitle >{post.userName}</CardTitle>
        <span className="text-purple-400">{post.ownerName}</span>
      </CardHeader>
      
      <CardContent className="border-s-2 border-green-200 pt-0 px-2 pb-4 ml-5 mr-4 mb-6">{post.content}</CardContent>

      <CardFooter className="flex justify-between">
        <div>
          <Button onClick={() => onLike(post.id)} className="mr-2 bg-orange-400 hover:bg-orange-500">
            Like ({post.likes})
          </Button>
          <Button onClick={() => onDislike(post.id)} className="mr-2 bg-red-400 hover:bg-red-500">
            Dislike ({post.dislikes})
          </Button>
        </div>
        <Button disabled={!onShare} onClick={() => onShare(post)} className="bg-purple-500 hover:bg-purple-600">Share ({post.shared})</Button>
      </CardFooter>
    </Card>
  );
};

const PostsList = ({ user, onLike, onDislike, onShare }) => {
  return (
    user.posts.map((post) => (
      <Post
        key={post.id}
        post={post}
        onLike={onLike}
        onDislike={onDislike}
        onShare={onShare}
        isShared={post.isShared}
      />
    ))
  )
}

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
      setPosts({ [currentUser.id]: [...currentUser.posts, newPost] });
      setNewPostContent("");
    }
  };

  const handleLike = (isFriendPost) => (postId) => {
    const friendUser = users.find(user => user.id !== currentUser.id)
    const userToUpdatePost = isFriendPost ? friendUser : currentUser
    setPosts(
      {
        [userToUpdatePost.id]: userToUpdatePost.posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      }
    );
  };

  const handleDislike = (isFriendPost) => (postId) => {
    const friendUser = users.find(user => user.id !== currentUser.id)
    const userToUpdatePost = isFriendPost ? friendUser : currentUser
    setPosts(
      {
        [userToUpdatePost.id]: userToUpdatePost.posts.map((post) =>
          post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
        )
      }
    );
  };

  const handleShare = (post) => {
    const sharedPost = {
      ...post,
      ownerName: post.userName === currentUser.name ? null : post.userName,
      userName: currentUser.name,
      id: Date.now(),
      shared: post.shared + 1,
      isShared: true,
    };
    const isPostOwner = post.userName === currentUser.name

    const newPosts = [...currentUser.posts, sharedPost]
    const friend = users
      .find((u) => u.name === post.userName)
    const friendsNewPosts = !isPostOwner && ({
      [friend.id]: friend
        .posts.map((p) => (p.id === post.id ? { ...p, shared: p.shared + 1 } : p))
    })

    setPosts({ [currentUser.id]: newPosts, ...friendsNewPosts });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-2">
        <Button className="p-0" onClick={() => setCurrentPage("profile")} variant="link">
          <span className="text-3xl">{currentUser.name}</span>'s
          Feed
        </Button>
      </h1>
      <Textarea
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder="What's on your mind?"
        className="mb-4 border-2 hover:border-green-200"
      />
      <Button onClick={handlePublish} className="mb-4 bg-green-600 hover:bg-green-700">
        Publish
      </Button>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Posts</TabsTrigger>
          <TabsTrigger value="friends">Friend's Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <PostsList user={currentUser} onLike={handleLike()} onDislike={handleDislike()} />
        </TabsContent>
        
        <TabsContent value="friends">
          {users
            .filter((user) => user.id !== currentUser.id)
            .flatMap((user) => <PostsList user={user} onLike={handleLike()} onDislike={handleDislike()} onShare={handleShare} />)
          }
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
      <h1 className="text-2xl font-bold mb-4">{currentUser?.name}'s Profile</h1>
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
  const [currentUserId, setCurrentUserId] = useState(initialUsers[0].id);
  const [currentPage, setCurrentPage] = useState("feed");

  const currentUser = users.find((user) => user.id === currentUserId);

  // { 1: [], 2: [] } 
  const setPosts = (postsByIds) => {
    setUsers(
      users.map((user) => (!!postsByIds[user.id] ? { ...user, posts: postsByIds[user.id] } : user))
    );
  };

  const switchUser = () => {
    setCurrentUserId(currentUserId === initialUsers[0].id ? initialUsers[1].id : initialUsers[0].id);
  };

  return (
    <div className="bg-blue-100 h-full flex rounded-full">
    <div className="max-w-2xl mx-auto my-auto bg-blue-400 rounded-3xl">
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
    </div>
  );
}