'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Search, User, ArrowLeft, LogOut, LogIn } from 'lucide-react';

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

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (!content) return '';
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Z.ai Blog"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Z.ai Blog
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 transition-all duration-200 focus:w-80"
                />
              </div>
              {status === 'loading' ? (
                <Skeleton className="h-10 w-20" />
              ) : session ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">
                      {session.user?.name || session.user?.email || 'User'}
                    </span>
                  </div>
                  <Button variant="outline" onClick={() => signOut()} className="transition-all duration-200 hover:scale-105">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => signIn()} className="transition-all duration-200 hover:scale-105">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              {session && (
                <Button onClick={() => router.push('/create')} className="transition-all duration-200 hover:scale-105">
                  Create Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
          <p className="text-muted-foreground">Discover the latest insights and stories from our community</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts found</p>
            {session && (
              <Button onClick={() => router.push('/create')}>Create your first post</Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">
                      {post.author?.name || post.author?.email || 'Anonymous'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {truncateContent(post.content || '')}
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="group">
                      Read More
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="relative w-6 h-6">
                <img
                  src="/logo.svg"
                  alt="Z.ai Blog"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-semibold">Z.ai Blog</span>
            </div>
            <p className="text-sm">
              Built with ❤️ using Next.js, Prisma, and shadcn/ui
            </p>
            <p className="text-xs mt-2">
              © 2024 Z.ai Blog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}