'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content?: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else if (response.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to fetch post');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!post) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${post.id}?authorId=${post.authorId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.push('/');
        } else {
          setError('Failed to delete post');
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        setError('Failed to delete post');
      }
    }
  };

  const handleEdit = () => {
    if (post) {
      router.push(`/post/${post.id}/edit`);
    }
  };

  const isAuthor = session && session.user?.id === post?.authorId;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || 'Post not found'}</h1>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="relative w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Z.ai Blog"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold">Z.ai Blog</h1>
            </div>
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
            <CardTitle className="text-3xl leading-tight">{post.title}</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span>
                By {post.author?.name || post.author?.email || 'Anonymous'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {post.content || 'No content available.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}