import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import TextArea from '@/Components/TextArea';
import CommentModal from '@/Components/CommentModal';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Repeat2,
    Bookmark,
    Share2,
    MoreHorizontal,
    SendHorizonal,
    Image as ImageIcon,
    SquareKanban
} from 'lucide-react';
import { Tab, Tabs } from '@mui/material';

export default function Index({ auth = null, user = null, posts = [] }) {
    const [valueTab, setValueTab] = useState('post');
    const [postContent, setPostContent] = useState('');
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    const handleTabs = (event, newValue) => {
        setValueTab(newValue);
    };

    const handleLike = (id) => {
        // Implement like logic or reuse from elsewhere
        axios.post(route('posts.like', id));
    };

    const handleSubmitPost = () => {
        if (postContent.trim() === '') return;
        setIsLoadingSubmit(true);
        axios.post('/posts', { body: postContent })
            .then(() => {
                setPostContent('');
                router.get(
                    route('profile.index'), {
                        preserveState: true,
                        preserveScroll: true,
                    },
                );
            })
            .catch((error) => {
                console.error("Failed to create post:", error);
            })
            .finally(() => {
                setIsLoadingSubmit(false);
            });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${user?.name || 'Profile'}`} />
            <div className="py-2 bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navigation Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 rounded-xl text-gray-500 hover:text-[#1F6F5F] hover:bg-[#1F6F5F]/5 dark:text-gray-400 dark:hover:bg-white/5 transition-all"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">@{user?.username}</p>
                        </div>
                    </div>

                    <Card className='p-6'>
                        <div className='flex justify-between items-start mb-4'>
                            <div>
                                <h2 className='text-2xl font-black text-gray-900 dark:text-white leading-tight'>{user?.name}</h2>
                                <p className='text-gray-500 dark:text-gray-400 font-medium'>@{user?.username}</p>
                            </div>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-xl shadow-[#1F6F5F]/20 text-3xl overflow-hidden">
                                {user?.profile?.profil_picture ? (
                                    <img src={user.profile.profil_picture} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.[0] || 'U'
                                )}
                            </div>
                        </div>

                        <div className='mb-6'>
                            <p className='text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed'>
                                {user?.profile?.bio || 'No bio yet.'}
                            </p>
                        </div>

                        <div className='flex items-center gap-6 mb-8'>
                            <div className='flex items-center gap-1.5 group cursor-pointer'>
                                <span className='text-sm font-bold text-gray-900 dark:text-white'>{user?.followers_count || 0}</span>
                                <span className='text-sm text-gray-500 group-hover:underline'>followers</span>
                            </div>
                            <div className='flex items-center gap-1.5 group cursor-pointer'>
                                <span className='text-sm font-bold text-gray-900 dark:text-white'>{user?.following_count || 0}</span>
                                <span className='text-sm text-gray-500 group-hover:underline'>following</span>
                            </div>
                            <div className='ml-auto'>
                                <SquareKanban size={22} className="text-gray-400" />
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <Button 
                                onClick={() => router.get(route('profile.edit'))}
                                variant="secondary" 
                                className="w-full"
                            >
                                Edit profile
                            </Button>
                            <Button variant="secondary" className="px-3">
                                <Share2 size={18} />
                            </Button>
                        </div>

                        <div className='mt-8 w-full border-b border-gray-100 dark:border-white/5'>
                            <Tabs 
                                value={valueTab} 
                                onChange={handleTabs} 
                                variant='fullWidth'
                                textColor="primary" 
                                indicatorColor="primary" 
                                sx={{
                                    '& .MuiTab-root': {
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        textTransform: 'none',
                                        color: '#9CA3AF',
                                        '&.Mui-selected': {
                                            color: '#1F6F5F',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        height: 3,
                                        borderRadius: '3px 3px 0 0',
                                        backgroundColor: '#1F6F5F',
                                    }
                                }}
                            >
                                <Tab value="post" label="Post" />
                                <Tab value="replies" label="Replies" />
                                <Tab value="repost" label="Repost" />
                                <Tab value="media" label="Media" />
                            </Tabs>
                        </div>

                        <div className='mt-6'>
                            {valueTab === 'post' && (
                                <div className='space-y-6'>
                                    {/* Quick Post Box */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-[#1F6F5F]/10 flex items-center justify-center text-[#1F6F5F] font-bold">
                                                {user?.name?.[0] || 'U'}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <TextArea
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                                placeholder="What's on your mind?"
                                                className="border-none bg-transparent focus:ring-0 px-0 py-2 text-lg shadow-none min-h-[80px]"
                                                rows={2}
                                            />
                                            <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-50 dark:border-white/5">
                                                <div className="flex gap-1">
                                                    <ActionIcon icon={ImageIcon} className="w-8 h-8" />
                                                </div>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm"
                                                    onClick={handleSubmitPost}
                                                    processing={isLoadingSubmit}
                                                >
                                                    Post
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Posts Feed */}
                                    <div className="space-y-4">
                                        {posts.length > 0 ? (
                                            posts.map((post) => (
                                                <div key={post.id} className="p-4 rounded-2xl border border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-all">
                                                    <div className="flex gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#1F6F5F] flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                                            {user?.profile?.profil_picture ? (
                                                                <img src={user.profile.profil_picture} alt={user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                user?.name?.[0] || 'U'
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    <span className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</span>
                                                                    <span className="text-gray-400 text-sm">@{user?.username}</span>
                                                                    <span className="text-gray-300">•</span>
                                                                    <span className="text-gray-400 text-sm whitespace-nowrap">{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                                    <MoreHorizontal size={18} />
                                                                </button>
                                                            </div>
                                                            <p className="mt-1 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                                {post.body}
                                                            </p>
                                                            <div className="flex justify-between items-center mt-4 max-w-sm">
                                                                <ActionIcon 
                                                                    icon={Heart} 
                                                                    count={post.likes_count} 
                                                                    isActive={post.is_liked}
                                                                    onClick={() => handleLike(post.id)}
                                                                />
                                                                <ActionIcon icon={MessageCircle} count={post.comments_count} />
                                                                <ActionIcon icon={Repeat2} count={post.reposts_count} />
                                                                <ActionIcon icon={Share2} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                                                <p className="text-gray-400 font-medium">No posts yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}