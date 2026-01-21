'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function FilterToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === 'all') {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (key: string, value: string) => {
        router.push(`?${createQueryString(key, value)}`);
    };

    return (
        <div className="flex flex-wrap gap-4 mb-6 p-4 glass-panel rounded-lg items-center">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">Sort:</span>
                <Select
                    defaultValue={searchParams.get('sort') || 'date'}
                    onValueChange={(val) => handleFilterChange('sort', val)}
                >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date">Date Published</SelectItem>
                        <SelectItem value="quality">Quality Score</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-4 w-[1px] bg-border mx-2 hidden md:block"></div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">Audience:</span>
                <Select
                    defaultValue={searchParams.get('audience') || 'all'}
                    onValueChange={(val) => handleFilterChange('audience', val)}
                >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Audiences</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="enthusiast">Enthusiast</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">Sentiment:</span>
                <Select
                    defaultValue={searchParams.get('sentiment') || 'all'}
                    onValueChange={(val) => handleFilterChange('sentiment', val)}
                >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="opinion">Opinion</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
