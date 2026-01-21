'use client';

import { useState, useEffect, useCallback } from 'react';
import { CoffeePost } from '@/lib/types';
import { PostCard } from './PostCard';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { updatePostStatus } from '@/actions/posts';

interface PostFeedProps {
    initialPosts: CoffeePost[];
}

export function PostFeed({ initialPosts }: PostFeedProps) {
    const [posts, setPosts] = useState<CoffeePost[]>(initialPosts);

    // Sync prop changes if server revalidates and passes new initialPosts
    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    const handleAction = useCallback((id: string, status: 'approved' | 'rejected') => {
        // Optimistic update: remove from list immediately
        setPosts(current => current.filter(p => p.id !== id));

        // Trigger server action in background (PostCard also does this, but for shortcuts we need it here)
        // Actually PostCard's onAction can handle the list removal, but we need to call the server action if it was a shortcut key
        // Let's centralize the Server Action call if triggered via shortcut
        // PostCard calls updatePostStatus internally. 
    }, []);

    const handleShortcutAction = useCallback(async (status: 'approved' | 'rejected') => {
        if (posts.length === 0) return;
        const topPost = posts[0];

        // Optimistic remove
        setPosts(current => current.slice(1));

        // Server execution
        await updatePostStatus(topPost.id, status);
    }, [posts]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignroe if input focused
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key.toLowerCase() === 'a') {
                handleShortcutAction('approved');
            } else if (e.key.toLowerCase() === 'r') {
                handleShortcutAction('rejected');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleShortcutAction]);

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCheck className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Inbox Zero</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    All caught up! There are no pending posts to review right now.
                    Great job keeping the feed clean.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-full mx-auto py-6">
            <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-xl font-semibold">Queue ({posts.length})</h2>
                <div className="text-xs text-muted-foreground hidden md:block">
                    <span className="bg-secondary px-2 py-1 rounded border border-border/50 text-[10px] mr-2">A</span> Approve
                    <span className="bg-secondary px-2 py-1 rounded border border-border/50 text-[10px] ml-2 mr-2">R</span> Reject
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onAction={() => {
                            // Remove from local state to animate out
                            setPosts(curr => curr.filter(p => p.id !== post.id))
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
