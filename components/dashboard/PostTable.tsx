'use client';

import { CoffeePost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ExternalLink, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { updatePostStatus } from '@/actions/posts';
import { useState } from 'react';
import Link from 'next/link';

interface PostTableProps {
    posts: CoffeePost[];
    selectionMode: boolean;
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    onAction: (id: string, status: 'approved' | 'rejected') => void;
}

export function PostTable({
    posts,
    selectionMode,
    selectedIds,
    onToggleSelection,
    onAction
}: PostTableProps) {
    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic update handled by parent
        onAction(id, status);

        // Server action
        await updatePostStatus(id, status);
    };

    const qualityColor = (score: number | null) => {
        if (!score) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        if (score >= 8) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (score >= 5) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    };

    return (
        <div className="w-full overflow-auto rounded-md border border-border/40 bg-card/50 backdrop-blur-sm">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border/40">
                    <tr>
                        <th className="px-4 py-3 font-medium w-12 text-center">
                            {selectionMode ? "Sel" : "#"}
                        </th>
                        <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground transition-colors">
                            Date
                        </th>
                        <th className="px-4 py-3 font-medium w-[40%] cursor-pointer hover:text-foreground transition-colors">
                            Title
                        </th>
                        <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground transition-colors">
                            Source
                        </th>
                        <th className="px-4 py-3 font-medium text-center cursor-pointer hover:text-foreground transition-colors">
                            Score
                        </th>
                        <th className="px-4 py-3 font-medium text-right">
                            Status / Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {posts.map((post, index) => {
                        const isSelected = selectedIds.has(post.id);
                        return (
                            <tr
                                key={post.id}
                                className={cn(
                                    "group transition-colors",
                                    isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/20"
                                )}
                                onClick={() => selectionMode && onToggleSelection(post.id)}
                            >
                                <td className="px-4 py-3 text-center">
                                    {selectionMode ? (
                                        <div
                                            className={cn(
                                                "w-5 h-5 rounded-full border flex items-center justify-center mx-auto transition-all cursor-pointer",
                                                isSelected
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-muted-foreground/30 hover:border-primary/50"
                                            )}
                                        >
                                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground/50 font-mono text-xs">{index + 1}</span>
                                    )}
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                    <div className="flex flex-col">
                                        <span className="text-foreground font-medium">
                                            {post.published_date
                                                ? new Date(post.published_date).toLocaleDateString()
                                                : 'Unknown'}
                                        </span>
                                        <span className="text-[10px] opacity-70">
                                            {post.published_date
                                                ? new Date(post.published_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : ''}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-0.5">
                                        <Link
                                            href={`/posts/${post.id}`}
                                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1 group-hover:underline underline-offset-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            #{post.id.slice(0, 8)}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {/* Fallback avatar/icon */}
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0">
                                            {(post.author || 'U').charAt(0)}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate max-w-[150px]">
                                                {post.author || 'Unknown Author'}
                                            </span>
                                            <a
                                                href={post.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[10px] text-muted-foreground hover:text-primary truncate max-w-[150px] flex items-center gap-1"
                                            >
                                                {new URL(post.url).hostname.replace('www.', '')}
                                                <ExternalLink className="w-2 h-2" />
                                            </a>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 backdrop-blur-md", qualityColor(post.content_quality_score))}>
                                        {post.content_quality_score}/10
                                    </Badge>
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Badge variant="secondary" className="mr-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">
                                            PENDING
                                        </Badge>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                                            onClick={() => handleAction(post.id, 'approved')}
                                            title="Approve"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleAction(post.id, 'rejected')}
                                            title="Reject"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            asChild
                                        >
                                            <Link href={`/posts/${post.id}`} title="View Details">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
