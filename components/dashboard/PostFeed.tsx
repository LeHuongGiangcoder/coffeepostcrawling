'use client';

import { useState, useEffect, useCallback } from 'react';
import { CoffeePost } from '@/lib/types';
import { PostCard } from './PostCard';
import { PostTable } from './PostTable';
import { ViewToggle } from './ViewToggle';
import { Button } from '@/components/ui/button';
import { CheckCheck, CheckCircle2, XCircle } from 'lucide-react';
import { updatePostStatus, bulkUpdatePostStatus } from '@/actions/posts';
import { Badge } from '@/components/ui/badge';

interface PostFeedProps {
    initialPosts: CoffeePost[];
}

export function PostFeed({ initialPosts }: PostFeedProps) {
    const [posts, setPosts] = useState<CoffeePost[]>(initialPosts);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

    // Sync prop changes if server revalidates and passes new initialPosts
    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const toggleSelectionMode = () => {
        if (isSelectionMode) {
            // clear selection when exiting
            setSelectedIds(new Set());
        }
        setIsSelectionMode(!isSelectionMode);
    };

    const handleBulkAction = async (status: 'approved' | 'rejected') => {
        const idsToUpdate = Array.from(selectedIds);

        // Optimistic update
        setPosts(current => current.filter(p => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        setIsSelectionMode(false);

        await bulkUpdatePostStatus(idsToUpdate, status);
    };

    const handleAction = useCallback((id: string, status: 'approved' | 'rejected') => {
        // Optimistic update: remove from list immediately
        setPosts(current => current.filter(p => p.id !== id));
    }, []);

    const handleShortcutAction = useCallback(async (status: 'approved' | 'rejected') => {
        if (posts.length === 0 || isSelectionMode) return;
        const topPost = posts[0];

        // Optimistic remove
        setPosts(current => current.slice(1));

        // Server execution
        await updatePostStatus(topPost.id, status);
    }, [posts, isSelectionMode]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignroe if input focused
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key.toLowerCase() === 'a' && !isSelectionMode) {
                handleShortcutAction('approved');
            } else if (e.key.toLowerCase() === 'r' && !isSelectionMode) {
                handleShortcutAction('rejected');
            } else if (e.key === 'Escape' && isSelectionMode) {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleShortcutAction, isSelectionMode]);

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
        <div className="space-y-6 max-w-full mx-auto py-6 pb-24">
            <div className="flex justify-between items-center mb-4 px-1 sticky top-14 z-20 bg-background/80 backdrop-blur py-2 -mx-2 px-2 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Queue ({posts.length})</h2>
                    {isSelectionMode && selectedIds.size > 0 && (
                        <Badge variant="secondary" className="animate-in fade-in zoom-in">
                            {selectedIds.size} Selected
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

                    <div className="text-xs text-muted-foreground hidden md:block">
                        {!isSelectionMode && (
                            <>
                                <span className="bg-secondary px-2 py-1 rounded border border-border/50 text-[10px] mr-2">A</span> Approve
                                <span className="bg-secondary px-2 py-1 rounded border border-border/50 text-[10px] ml-2 mr-2">R</span> Reject
                            </>
                        )}
                    </div>

                    <Button
                        variant={isSelectionMode ? "secondary" : "ghost"}
                        size="sm"
                        onClick={toggleSelectionMode}
                        className={isSelectionMode ? "text-primary" : "text-muted-foreground"}
                    >
                        {isSelectionMode ? 'Cancel' : 'Select'}
                    </Button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <PostTable
                    posts={posts}
                    selectionMode={isSelectionMode}
                    selectedIds={selectedIds}
                    onToggleSelection={toggleSelection}
                    onAction={handleAction}
                />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onAction={() => {
                                // Remove from local state to animate out
                                setPosts(curr => curr.filter(p => p.id !== post.id))
                            }}
                            selectionMode={isSelectionMode}
                            isSelected={selectedIds.has(post.id)}
                            onToggleSelection={() => toggleSelection(post.id)}
                        />
                    ))}
                </div>
            )}

            {/* Floating Action Bar */}
            {isSelectionMode && selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 ring-1 ring-black/5">
                        <span className="text-sm font-medium mr-2">{selectedIds.size} selected</span>

                        <Button
                            size="sm"
                            onClick={() => handleBulkAction('rejected')}
                            className="rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject ({selectedIds.size})
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => handleBulkAction('approved')}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 border-0"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve ({selectedIds.size})
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
