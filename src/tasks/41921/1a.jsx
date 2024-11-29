import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/card";

const users = [
  { id: 1, name: 'Alice', avatar: 'A', totalLikes: 0, postsShared: 0, sharedPosts: 0 },
  { id: 2, name: 'Bob', avatar: 'B', totalLikes: 0, postsShared: 0, sharedPosts: 0 }
];

function App() {
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [posts, setPosts] = useState([]);

  const handlePost = (content) => {
    setPosts(prevPosts => [
      ...prevPosts,
      { id: Date.now(), content, user: currentUser, likes: 0, dislikes: 0, shared: false }
    ]);
  };

  const handleLike = (id, isLike) => {
    setPosts(prevPosts => 
      prevPosts.map(p => p.id === id ? { ...p, [isLike ? 'likes' : 'dislikes']: p[isLike ? 'likes' : 'dislikes'] + 1 } : p)
    );
  };

  const handleShare = (id) => {
    setPosts(prevPosts => {
      const post = prevPosts.find(p => p.id === id);
      if (post && !post.shared) {
        post.shared = true;
        return [...prevPosts, { ...post, shared: true, id: Date.now() }];
      }
      return prevPosts;
    });
  };

  const switchUser = () => {
    setCurrentUser(currentUser.id === 1 ? users[1] : users[0]);
  };

  const userPosts = useMemo(() => posts.filter(p => p.user.id === currentUser.id), [posts, currentUser]);
  const friendPosts = useMemo(() => posts.filter(p => p.user.id !== currentUser.id), [posts, currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <Avatar onClick={() => setCurrentUser(prev => ({...prev, isProfile: true}))}>
          <AvatarImage src={`/avatar/${currentUser.avatar}.png`} alt={currentUser.name} />
          <AvatarFallback>{currentUser.avatar}</AvatarFallback>
        </Avatar>
        <Button onClick={switchUser}>Switch User</Button>
      </div>

      {currentUser.isProfile ? (
        <ProfilePage user={currentUser} goHome={() => setCurrentUser(prev => ({...prev, isProfile: false}))} />
      ) : (
        <div>
          <PostInput onPost={handlePost} />
          <Tabs defaultValue="personal" className="w-full mt-4">
            <TabsList>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <PostList posts={userPosts} onLike={handleLike} onShare={handleShare} />
            </TabsContent>
            <TabsContent value="friends">
              <PostList posts={friendPosts} onLike={handleLike} onShare={handleShare} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function PostInput({ onPost }) {
  const [content, setContent] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="What's on your mind?"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => { onPost(content); setContent(''); }}>Post</Button>
      </CardFooter>
    </Card>
  );
}

function PostList({ posts, onLike, onShare }) {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card key={post.id} className={post.shared ? "border-l-4 border-black" : ""}>
          <CardHeader>
            <CardTitle>{post.user.name}</CardTitle>
          </CardHeader>
          <CardContent>{post.content}</CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button variant="ghost" onClick={() => onLike(post.id, true)}>Like ({post.likes})</Button>
              <Button variant="ghost" onClick={() => onLike(post.id, false)}>Dislike ({post.dislikes})</Button>
            </div>
            <Button onClick={() => onShare(post.id)}>Share</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function ProfilePage({ user, goHome }) {
  const userPosts = posts.filter(p => p.user.id === user.id);
  const sharedPostsCount = userPosts.filter(p => p.shared).length;
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}'s Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Total Likes: {totalLikes}</CardDescription>
        <CardDescription>Posts Shared: {user.postsShared}</CardDescription>
        <CardDescription>Shared Posts: {sharedPostsCount}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={goHome}>Home</Button>
      </CardFooter>
    </Card>
  );
}

export default App;