import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const CourseSkeleton = () => {
    return (
        <Card className="overflow-hidden cursor-pointer rounded-lg dark:bg-gray-800  bg-pink shadow-md">
            <div className='relative'>
                <Skeleton className='w-full h-36 rounded-t-lg' />
            </div>
            <CardContent className="mt-2 px-5 py-4 space-y-3">
                <Skeleton className='h-6 w-3/4' />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Skeleton className='h-12 w-12 rounded-full' />
                    </div>
                    <Skeleton className='h-4 w-1/3' />
                    <Skeleton className='h-5 w-16 rounded' />
                </div>
                <Skeleton className='h-6 w-1/4' />
            </CardContent>
        </Card>
    );
}

export default CourseSkeleton;