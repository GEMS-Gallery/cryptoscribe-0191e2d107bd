import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import { backend } from 'declarations/backend';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (title: string, body: string, author: string) => {
    try {
      await backend.createPost(title, body, author);
      await fetchPosts();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Crypto Blog
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsFormOpen(true)}
        sx={{ mb: 3 }}
      >
        New Post
      </Button>
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <PostList posts={posts} />
      )}
      <PostForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreatePost}
      />
    </Container>
  );
};

export default App;
