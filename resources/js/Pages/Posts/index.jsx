import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import TextArea from '@/Components/TextArea';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Card from '@/Components/Card';
import {
    SendHorizonal,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    MoreHorizontal,
    Repeat2,
    Image as ImageIcon
} from 'lucide-react';

export default function Index({ posts, auth }) {
    const [data, setData] = useState(posts);
    const [userLoggedIn, setUserLoggedIn] = useState(auth);


    useEffect(() => {
        setData(posts);
        setUserLoggedIn(auth);
    }, [posts]);


    return (
        <AuthenticatedLayout>
            <Head title="Posts" />
            <div className="py-8 bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Create Post Section */}
                    <Card className="mb-6" animate={false}>
                        <Card.Body>
                            <div className='flex gap-4'>
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-[#1F6F5F]/10 flex items-center justify-center text-[#1F6F5F] font-bold">
                                        {userLoggedIn.name[0] ?? 'U'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <TextArea
                                        placeholder="Share something interesting..."
                                        className="border-none bg-transparent focus:ring-0 px-0 py-2 text-lg shadow-none"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className="flex justify-between items-center py-3 bg-gray-50 dark:bg-[#0f0f0f]">
                            <div className="flex gap-1">
                                <button className="p-2 rounded-xl text-gray-400 hover:text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all">
                                    <ImageIcon size={20} />
                                </button>
                            </div>
                            <Button variant="primary" size="sm" icon={SendHorizonal}>Post</Button>
                        </Card.Footer>
                    </Card>

                    {/* Posts Feed */}
                    <div className="space-y-4">
                        {data.data.map((post) => (
                            <Card key={post.id} className="transition-all hover:shadow-md">
                                <Card.Body className="p-5">
                                    {/* Post Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-lg shadow-[#1F6F5F]/20 text-lg">
                                                {post.user?.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                                                    {post.user?.name || 'Anonymous User'}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    @{post.user?.username || 'anonymous'} • {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    {/* Post Body */}
                                    <div className="mb-4">
                                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">
                                            {post.body}
                                        </p>
                                    </div>

                                    {/* Post Actions */}
                                    <div className="flex justify-between items-center pt-2 mt-4 border-t border-gray-50 dark:border-white/4">
                                        <div className="flex items-center gap-4 sm:gap-8">
                                            <ActionIcon
                                                icon={Heart}
                                                count={post.likes_count || 0}
                                                activeClassName="text-red-500 bg-red-50 dark:bg-red-500/10"
                                            />
                                            <ActionIcon
                                                icon={MessageCircle}
                                                count={post.comments_count || 0}
                                            />
                                            <ActionIcon
                                                icon={Repeat2}
                                                count={post.reposts_count || 0}
                                                inactiveClassName="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <ActionIcon icon={Bookmark} />
                                            <ActionIcon icon={Share2} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
