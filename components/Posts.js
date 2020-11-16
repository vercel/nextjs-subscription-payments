import { useState, useEffect } from 'react';
import { supabase } from '../utils/initSupabase';

export default function Pricing() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      // Load all posts that I have access to based on my subscription status.
      // Access control is done via Supabase Auth policies on the posts table, see schema.sql file.
      const { data: posts, error } = await supabase.from('posts').select('*');
      if (error) alert(error.message);
      setPosts(posts);
      setLoading(false);
    }
    getPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <h2>Posts</h2>
      {!posts.length ? <p>Sorry, no posts for you!</p> : ''}
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
}
