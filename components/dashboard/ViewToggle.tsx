'use client';

import { LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
    viewMode: 'card' | 'table';
    onViewChange: (mode: 'card' | 'table') => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center p-1 bg-secondary/50 rounded-lg border border-border/50">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('card')}
                className={cn(
                    "h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-background/50",
                    viewMode === 'card' && "bg-background text-foreground shadow-sm hover:bg-background"
                )}
                title="Grid View"
            >
                <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('table')}
                className={cn(
                    "h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-background/50",
                    viewMode === 'table' && "bg-background text-foreground shadow-sm hover:bg-background"
                )}
                title="Table View"
            >
                <Table className="w-4 h-4" />
            </Button>
        </div>
    );
}
