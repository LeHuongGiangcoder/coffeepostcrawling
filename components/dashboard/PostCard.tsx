'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CoffeePost } from '@/lib/types';
import { updatePostStatus } from '@/actions/posts';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface PostCardProps {
    post: CoffeePost;
    onAction?: () => void;
}

export function PostCard({ post, onAction }: PostCardProps) {
    const [optimisticStatus, setOptimisticStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const router = useRouter();

    const qualityColor = (score: number | null) => {
        if (!score) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        if (score >= 8) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (score >= 5) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    };

    const [imageError, setImageError] = useState(false);

    const handleAction = async (status: 'approved' | 'rejected', e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setOptimisticStatus(status);
        if (onAction) onAction();
        await updatePostStatus(post.id, status);
    };

    if (optimisticStatus !== 'pending') return null;

    return (
        <Link href={`/posts/${post.id}`} className="block group h-full">
            <Card className="glass-panel h-full transition-all duration-300 hover:border-gray-600 hover:shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[160px]">
                {/* Placeholder Image Section (Left) - Responsive width */}
                <div className="w-full md:w-[150px] lg:w-[170px] bg-secondary/20 relative flex-shrink-0 flex items-center justify-center border-r border-border/40 overflow-hidden group-hover/image:opacity-90 transition-opacity">
                    {/* Image preview */}
                    {(post.metadata && (post.metadata['og:image'] || post.metadata.ogImage) && !imageError) ? (
                        <>
                            <img
                                src={post.metadata['og:image'] || post.metadata.ogImage}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={() => setImageError(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            <div className="absolute top-2 left-2 z-10">
                                <Badge variant="outline" className={clsx("backdrop-blur-md shadow-sm border-white/20 text-white text-[10px] px-1.5 py-0", qualityColor(post.content_quality_score).replace('bg-emerald-500/10', 'bg-emerald-500/80').replace('bg-yellow-500/10', 'bg-yellow-500/80').replace('bg-red-500/10', 'bg-red-500/80').replace('text-emerald-500', 'text-white').replace('text-yellow-500', 'text-white').replace('text-red-500', 'text-white'))}>
                                    {post.content_quality_score}/10
                                </Badge>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 opacity-50" />
                            <div className="relative z-10 text-center p-2">
                                <Badge variant="outline" className={clsx("mb-1 text-[10px] px-1.5 py-0 backdrop-blur-md", qualityColor(post.content_quality_score))}>
                                    {post.content_quality_score}/10
                                </Badge>
                                <h3 className="text-xl font-serif font-bold text-muted-foreground/20 select-none">Coffee</h3>
                            </div>
                        </>
                    )}
                </div>

                {/* Content Section (Right) */}
                <div className="flex-1 flex flex-col p-3">
                    <div className="flex justify-between items-start mb-1.5">
                        <div>
                            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1 flex-wrap">
                                <span className="font-medium text-foreground truncate max-w-[80px]">{post.author || 'Unknown'}</span>
                                <span className="text-muted-foreground/60">•</span>
                                <span className="truncate max-w-[100px]">{new URL(post.url).hostname.replace('www.', '')}</span>
                                <span className="text-muted-foreground/60">•</span>
                                <span>{post.published_date ? formatDistanceToNow(new Date(post.published_date), { addSuffix: true }) : 'Recently'}</span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/50 px-1.5 py-0 rounded whitespace-nowrap">
                                {post.published_date ? new Date(post.published_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </span>
                        </div>
                    </div>

                    {/* Key Insights - Always Visible & Styled */}
                    {post.key_insights && (
                        <div className="bg-secondary/10 rounded-md p-2 border border-border/30 mt-1 mb-2">
                            <div className="flex items-center gap-1 mb-1 text-[10px] font-semibold text-primary uppercase tracking-wide opacity-80">
                                <Sparkles className="w-2.5 h-2.5" /> Key Insights
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium line-clamp-2">
                                {post.key_insights.split('\n').map((line) => (line.trim().startsWith('-') ? line : `• ${line}`)).join('\n')}
                            </div>
                        </div>
                    )}

                    <div className="flex-grow"></div>

                    <CardFooter className="p-0 pt-1 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-[10px] text-primary font-medium group-hover:underline underline-offset-4">
                            Read Full <ChevronRight className="w-2.5 h-2.5" />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleAction('rejected', e)}
                                className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10 hover:text-destructive border border-destructive/30"
                            >
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                onClick={(e) => handleAction('approved', e)}
                                className="h-7 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-lg shadow-emerald-900/20"
                            >
                                Approve
                            </Button>
                        </div>
                    </CardFooter>
                </div>
            </Card>
        </Link>
    );
}
