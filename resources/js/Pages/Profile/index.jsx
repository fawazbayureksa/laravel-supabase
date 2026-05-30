import React, { useState, useEffect } from 'react';
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

export default function Index({ auth = null, user = null, posts = [], reposts = [], replies = [], media = [] }) {
    const [postsData, setPostsData] = useState(posts);
    const [repostsData, setRepostsData] = useState(reposts);
    const [repliesData, setRepliesData] = useState(replies);
    const [mediaData, setMediaData] = useState(media);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [commentProcessing, setCommentProcessing] = useState(false);
    const [valueTab, setValueTab] = useState('post');
    const [postContent,setPostContent] = useState('');

    useEffect(() => {
        setPostsData(posts);
        setRepostsData(reposts);
        setRepliesData(replies);
        setMediaData(media);
    }, [posts, reposts, replies, media]);

    const handleTabs = (event, newValue) => {
        setValueTab(newValue);
    };

    const handleDetailPost = (id) => {
        router.get(`/posts/${id}`);
    };

    const handleLike = (e, id) => {
        e.stopPropagation();
        const post = postsData?.find(p => p.id === id)
            || repostsData?.find(r => r.post?.id === id)?.post
            || mediaData?.find(p => p.id === id);
        if (!post) return;

        const originalPost = { ...post };
        const newIsLiked = !post.is_liked;
        const delta = newIsLiked ? 1 : -1;
        const newLikesCount = Math.max(0, (post.likes_count || 0) + delta);

        const updateAll = (fields) => {
            setPostsData(prev => prev?.map(item => item.id === id ? { ...item, ...fields } : item));
            setRepostsData(prev => prev?.map(item => item.post?.id === id ? { ...item, post: { ...item.post, ...fields } } : item));
            setMediaData(prev => prev?.map(item => item.id === id ? { ...item, ...fields } : item));
        };

        updateAll({ is_liked: newIsLiked, likes_count: newLikesCount });

        axios.post(route('posts.like', id))
            .then((response) => {
                updateAll({
                    is_liked: response.data.is_liked,
                    likes_count: response.data.likes_count
                });
            })
            .catch((error) => {
                console.error("Failed to like post:", error);
                updateAll(originalPost);
            });
    };

    const handleBookmark = (e, id) => {
        e.stopPropagation();
        const post = postsData?.find(p => p.id === id)
            || repostsData?.find(r => r.post?.id === id)?.post
            || mediaData?.find(p => p.id === id);
        if (!post) return;

        const originalPost = { ...post };
        const newIsBookmarked = !post.is_bookmarked;
        const delta = newIsBookmarked ? 1 : -1;
        const newBookmarksCount = Math.max(0, (post.bookmarks_count || 0) + delta);

        const updateAll = (fields) => {
            setPostsData(prev => prev?.map(item => item.id === id ? { ...item, ...fields } : item));
            setRepostsData(prev => prev?.map(item => item.post?.id === id ? { ...item, post: { ...item.post, ...fields } } : item));
            setMediaData(prev => prev?.map(item => item.id === id ? { ...item, ...fields } : item));
        };

        updateAll({ is_bookmarked: newIsBookmarked, bookmarks_count: newBookmarksCount });

        axios.post(`/posts/bookmark/${id}`)
            .then((response) => {
                updateAll({
                    is_bookmarked: response.data.is_bookmarked,
                    bookmarks_count: response.data.bookmarks_count
                });
            })
            .catch((error) => {
                console.error("Failed to bookmark post:", error);
                updateAll(originalPost);
            });
    };

    const handleRepost = (e, id) => {
        e.stopPropagation();
        const post = postsData?.find(p => p.id === id)
            || repostsData?.find(r => r.post?.id === id)?.post
            || mediaData?.find(p => p.id === id);
        if (!post) return;

        const originalPost = { ...post };
        const newIsReposted = !post.is_reposted;
        const delta = newIsReposted ? 1 : -1;
        const newRepostsCount = Math.max(0, (post.reposts_count || 0) + delta);

        const updateAll = (fields) => {
            setPostsData(prev => prev?.map(item => item.id === id ? { ...item, ...fields } : item));
            setRepostsData(prev => prev?.map(item => item.post?.id === id ? { ...item, post: { ...item.post, ...fields } } : item));
            setMediaData(prev => prev?.map(item => item.id === id ? { ...item, ...fields } : item));
        };

        updateAll({ is_reposted: newIsReposted, reposts_count: newRepostsCount });

        axios.post(`/posts/repost/${id}`)
            .then((response) => {
                updateAll({
                    is_reposted: response.data.is_reposted,
                    reposts_count: response.data.reposts_count
                });
            })
            .catch((error) => {
                console.error("Failed to repost:", error);
                updateAll(originalPost);
            });
    };

    const handleComment = (e, id) => {
        e.stopPropagation();
        const post = postsData?.find(p => p.id === id)
            || repostsData?.find(r => r.post?.id === id)?.post
            || mediaData?.find(p => p.id === id);
        if (!post) return;
        setSelectedPost(post);
        setCommentModalOpen(true);
    };

    const submitComment = (body) => {
        if (!selectedPost) return;
        setCommentProcessing(true);

        axios.post(`/posts/comment/${selectedPost.id}`, { body })
            .then((response) => {
                const updateAll = (fields) => {
                    setPostsData(prev => prev?.map(item => item.id === selectedPost.id ? { ...item, ...fields } : item));
                    setRepostsData(prev => prev?.map(item => item.post?.id === selectedPost.id ? { ...item, post: { ...item.post, ...fields } } : item));
                    setMediaData(prev => prev?.map(item => item.id === selectedPost.id ? { ...item, ...fields } : item));
                };
                updateAll({ comments_count: response.data.comments_count });
                setCommentModalOpen(false);
            })
            .catch((error) => {
                console.error("Failed to comment:", error);
            })
            .finally(() => {
                setCommentProcessing(false);
            });
    };

    const handleLikeComment = (e, id) => {
        e.stopPropagation();
        const reply = repliesData?.find(r => r.id === id);
        if (!reply) return;

        const originalReply = { ...reply };
        const newIsLiked = !reply.is_liked;
        const delta = newIsLiked ? 1 : -1;
        const newLikesCount = Math.max(0, (reply.likes_count || 0) + delta);

        setRepliesData(prev => prev?.map(item =>
            item.id === id
                ? { ...item, is_liked: newIsLiked, likes_count: newLikesCount }
                : item
        ));

        axios.post(`/comments/like/${id}`)
            .then((response) => {
                setRepliesData(prev => prev?.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            is_liked: response.data.is_liked,
                            likes_count: response.data.likes_count
                        }
                        : item
                ));
            })
            .catch((error) => {
                console.error("Failed to like comment:", error);
                setRepliesData(prev => prev?.map(item => item.id === id ? originalReply : item));
            });
    };

    const handleReplyClick = (e, post) => {
        e.stopPropagation();
        if (!post) return;
        setSelectedPost(post);
        setCommentModalOpen(true);
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
                                                <Button variant="primary" size="sm">Post</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Posts Feed */}
                                    <div className="space-y-4">
                                        {postsData.length > 0 ? (
                                            postsData.map((post) => (
                                                <div 
                                                    key={post.id} 
                                                    onClick={() => handleDetailPost(post.id)}
                                                    className="p-4 border-b border-gray-50 dark:border-white/5 dark:hover:bg-white/2 transition-all cursor-pointer"
                                                >
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
                                                                    onClick={(e) => handleLike(e, post.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={MessageCircle} 
                                                                    count={post.comments_count} 
                                                                    onClick={(e) => handleComment(e, post.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={Repeat2} 
                                                                    count={post.reposts_count} 
                                                                    isActive={post.is_reposted}
                                                                    onClick={(e) => handleRepost(e, post.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={Bookmark} 
                                                                    count={post.bookmarks_count} 
                                                                    isActive={post.is_bookmarked}
                                                                    onClick={(e) => handleBookmark(e, post.id)}
                                                                />
                                                                <ActionIcon icon={Share2} onClick={(e) => { e.stopPropagation(); /* share logic */ }} />
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
                            {valueTab === 'replies' && (
                                <div className='space-y-6'>
                                    <div className="space-y-4">
                                        {repliesData.length > 0 ? (
                                            repliesData.map((reply) => (
                                                <div key={reply.id} onClick={() => handleDetailPost(reply?.post?.id)} className="p-4 border-b border-gray-50 dark:border-white/5 dark:hover:bg-white/2 transition-all cursor-pointer">
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
                                                                    <span className="text-gray-400 text-sm whitespace-nowrap">{new Date(reply.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                                    <MoreHorizontal size={18} />
                                                                </button>
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                Replying to <span className="text-[#1F6F5F] font-semibold">@{reply?.post?.user?.username || 'anonymous'}</span>
                                                            </div>
                                                            <p className="mt-2 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                                {reply.body}
                                                            </p>
                                                            {reply.image && (
                                                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 max-w-sm">
                                                                    <img src={reply.image} className="w-full h-auto object-cover max-h-[300px]" alt="Attachment" />
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center mt-4 max-w-sm">
                                                                <ActionIcon 
                                                                    icon={Heart} 
                                                                    count={reply.likes_count} 
                                                                    isActive={reply.is_liked} 
                                                                    onClick={(e) => handleLikeComment(e, reply.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={MessageCircle} 
                                                                    count={reply.replies_count} 
                                                                    onClick={(e) => handleReplyClick(e, reply?.post)}
                                                                />
                                                                <ActionIcon icon={Share2} onClick={(e) => { e.stopPropagation(); /* share logic */ }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                                                <p className="text-gray-400 font-medium">No replies yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {valueTab === 'repost' && (
                                <div className='space-y-6'>
                                    <div className="space-y-4">
                                        {repostsData.length > 0 ? (
                                            repostsData.map((repost) => (
                                                <div key={repost.id} onClick={() => handleDetailPost(repost?.post?.id)} className="p-4 border-b border-gray-50 dark:border-white/5 dark:hover:bg-white/2 transition-all cursor-pointer">
                                                    <div className="flex gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#1F6F5F] flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                                            {repost?.post?.user?.profile?.profil_picture ? (
                                                                <img src={repost?.post?.user?.profile?.profil_picture} alt={repost?.post?.user?.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                repost?.post?.user?.name?.[0] || 'U'
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    <span className="font-bold text-gray-900 dark:text-white truncate">{repost?.post?.user?.name}</span>
                                                                    <span className="text-gray-400 text-sm">@{repost?.post?.user?.username}</span>
                                                                    <span className="text-gray-300">•</span>
                                                                    <span className="text-gray-400 text-sm whitespace-nowrap">{new Date(repost?.post?.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                                    <MoreHorizontal size={18} />
                                                                </button>
                                                            </div>
                                                            <p className="mt-1 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                                {repost?.post?.body}
                                                            </p>
                                                            <div className="flex justify-between items-center mt-4 max-w-sm">
                                                                <ActionIcon 
                                                                    icon={Heart} 
                                                                    count={repost?.post?.likes_count} 
                                                                    isActive={repost?.post?.is_liked} 
                                                                    onClick={(e) => handleLike(e, repost?.post?.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={MessageCircle} 
                                                                    count={repost?.post?.comments_count} 
                                                                    onClick={(e) => handleComment(e, repost?.post?.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={Repeat2} 
                                                                    count={repost?.post?.reposts_count} 
                                                                    isActive={repost?.post?.is_reposted} 
                                                                    onClick={(e) => handleRepost(e, repost?.post?.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={Bookmark} 
                                                                    count={repost?.post?.bookmarks_count} 
                                                                    isActive={repost?.post?.is_bookmarked} 
                                                                    onClick={(e) => handleBookmark(e, repost?.post?.id)}
                                                                />
                                                                <ActionIcon icon={Share2} onClick={(e) => { e.stopPropagation(); /* share logic */ }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                                                <p className="text-gray-400 font-medium">No reposts yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {valueTab === 'media' && (
                                <div className='space-y-6'>
                                    <div className="space-y-4">
                                        {mediaData.length > 0 ? (
                                            mediaData.map((post) => (
                                                <div 
                                                    key={post.id} 
                                                    onClick={() => handleDetailPost(post.id)}
                                                    className="p-4 border-b border-gray-50 dark:border-white/5 dark:hover:bg-white/2 transition-all cursor-pointer"
                                                >
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
                                                            {post.body && (
                                                                <p className="mt-1 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                                    {post.body}
                                                                </p>
                                                            )}
                                                            {post.media?.length > 0 && (
                                                                <div className="mt-3 grid grid-cols-1 gap-2 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
                                                                    {post.media.map((item) => (
                                                                        <div key={item.id}>
                                                                            {item.type === 'image' && (
                                                                                <img src={item.path} className="w-full object-cover max-h-[400px]" alt="" />
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center mt-4 max-w-sm">
                                                                <ActionIcon 
                                                                    icon={Heart} 
                                                                    count={post.likes_count} 
                                                                    isActive={post.is_liked}
                                                                    onClick={(e) => handleLike(e, post.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={MessageCircle} 
                                                                    count={post.comments_count} 
                                                                    onClick={(e) => handleComment(e, post.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={Repeat2} 
                                                                    count={post.reposts_count} 
                                                                    isActive={post.is_reposted}
                                                                    onClick={(e) => handleRepost(e, post.id)}
                                                                />
                                                                <ActionIcon 
                                                                    icon={Bookmark} 
                                                                    count={post.bookmarks_count} 
                                                                    isActive={post.is_bookmarked}
                                                                    onClick={(e) => handleBookmark(e, post.id)}
                                                                />
                                                                <ActionIcon icon={Share2} onClick={(e) => { e.stopPropagation(); /* share logic */ }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                                                <p className="text-gray-400 font-medium">No media posts yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            
            <CommentModal 
                show={commentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                onSubmit={submitComment}
                post={selectedPost}
                user={auth?.user}
                processing={commentProcessing}
            />
        </AuthenticatedLayout>
    );
}