import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
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
    Image as ImageIcon,
    Smile,
    MapPin,
    Calendar
} from 'lucide-react';
import axios from 'axios';
import CommentModal from '@/Components/CommentModal';

export default function Index({ posts, auth = null }) {
    const [data, setData] = useState(posts.data);
    const [userLoggedIn, setUserLoggedIn] = useState(auth);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentProcessing, setCommentProcessing] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [isLoadingSubmit,setIsLoadingSubmit] = useState(false);

    const handleLike = (e,id) => {
        e.stopPropagation();
        const post = data?.find(p => p.id === id);
        if (!post) return;

        const originalPost = { ...post };
        const newIsLiked = !post.is_liked;
        const delta = newIsLiked ? 1 : -1;
        const newLikesCount = Math.max(0, (post.likes_count || 0) + delta);

        setData(prev => prev?.map(item =>
            item.id === id
                ? { ...item, is_liked: newIsLiked, likes_count: newLikesCount }
                : item
        ));

        axios.post(`/posts/like/${id}`)
            .then((response) => {
                setData(prev => prev?.map(item =>
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
                console.error("Failed to like post:", error);
                setData(prev => prev?.map(item => item.id === id ? originalPost : item));
            });
    }

    const handleBookmark = (e,id) => {
        e.stopPropagation();
        const post = data?.find(p => p.id === id);
        if (!post) return;

        const originalPost = { ...post };
        const newIsBookmarked = !post.is_bookmarked;
        const delta = newIsBookmarked ? 1 : -1;
        const newBookmarksCount = Math.max(0, (post.bookmarks_count || 0) + delta);

        setData(prev => prev?.map(item =>
            item.id === id
                ? { ...item, is_bookmarked: newIsBookmarked, bookmarks_count: newBookmarksCount }
                : item
        ));

        axios.post(`/posts/bookmark/${id}`)
            .then((response) => {
                setData(prev => prev?.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            is_bookmarked: response.data.is_bookmarked,
                            bookmarks_count: response.data.bookmarks_count
                        }
                        : item
                ));
            })
            .catch((error) => {
                console.error("Failed to bookmark post:", error);
                setData(prev => prev?.map(item => item.id === id ? originalPost : item));
            });
    }

    const handleRepost = (e,id) => {
        e.stopPropagation();
        const post = data?.find(p => p.id === id);
        if (!post) return;

        const originalPost = { ...post };
        const newIsReposted = !post.is_reposted;
        const delta = newIsReposted ? 1 : -1;
        const newRepostsCount = Math.max(0, (post.reposts_count || 0) + delta);

        setData(prev => prev?.map(item =>
            item.id === id
                ? { ...item, is_reposted: newIsReposted, reposts_count: newRepostsCount }
                : item
        ));

        axios.post(`/posts/repost/${id}`)
            .then((response) => {
                setData(prev => prev?.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            is_reposted: response.data.is_reposted,
                            reposts_count: response.data.reposts_count
                        }
                        : item
                ));
            })
            .catch((error) => {
                console.error("Failed to repost:", error);
                setData(prev => prev?.map(item => item.id === id ? originalPost : item));
            });
    }

    const handleComment = (e,id) => {
        e.stopPropagation();
        const post = data?.find(p => p.id === id);
        if (!post) return;
        setSelectedPost(post);
        setCommentModalOpen(true);
    }

    const submitComment = (body) => {
        if (!selectedPost) return;
        setCommentProcessing(true);

        axios.post(`/posts/comment/${selectedPost.id}`, { body })
            .then((response) => {
                setData(prev => prev?.map(item =>
                    item.id === selectedPost.id
                        ? { ...item, comments_count: response.data.comments_count }
                        : item
                ));
                setCommentModalOpen(false);
                setSelectedPost(null);
            })
            .catch((error) => {
                console.error("Failed to comment:", error);
            })
            .finally(() => {
                setCommentProcessing(false);
            });
    }

    const handleDetailPost = (id) => {
        router.get(`/posts/${id}`);
    }

    const handleSubmitPost = () => {
        // save post if postContent is not empty
        setIsLoadingSubmit(true);
        if(postContent.trim() === '') return;
        axios.post('/posts', { body: postContent })
            .then((response) => {
                setPostContent('');
                // setData(prev => [response.data, ...prev]);
                router.get(
                    route('posts.index'),{
                        preserveState: true,
                        preserveScroll: true,
                    },
                );
            })
            .catch((error) => {
                console.error("Failed to create post:", error);
            }).finally(() => {
                setIsLoadingSubmit(false);
            });
    }

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
                                    <div className="w-10 h-10 rounded-full bg-[#1F6F5F]/10 flex items-center justify-center text-[#1F6F5F] font-bold overflow-hidden">
                                        {userLoggedIn?.profile?.profil_picture ? (
                                            <img src={userLoggedIn.profile.profil_picture} alt={userLoggedIn.name} className="w-full h-full object-cover" />
                                        ) : (
                                            userLoggedIn?.name[0] ?? 'U'
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <TextArea
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                        placeholder="Share something interesting..."
                                        className="border-none bg-transparent focus:ring-0 px-0 py-2 text-lg shadow-none"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className="flex justify-between items-center py-3 bg-gray-50 dark:bg-[#0f0f0f]">
                            <div className="flex gap-1">
                                    <button className="p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all">
                                        <ImageIcon size={20} />
                                    </button>
                                    <button className="p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all">
                                        <Smile size={20} />
                                    </button>
                                    <button className="p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all">
                                        <MapPin size={20} />
                                    </button>
                                    <button className="p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all">
                                        <Calendar size={20} />
                                    </button>
                            </div>
                            <Button variant="primary" onClick={handleSubmitPost} processing={isLoadingSubmit} size="sm" icon={SendHorizonal}>Post</Button>
                        </Card.Footer>
                    </Card>

                    {/* Posts Feed */}
                    <div className="space-y-4">
                        {data?.map((post) => (
                            <Card key={post.id} className="transition-all hover:shadow-md cursor-pointer" onClick={() => handleDetailPost(post.id)}>
                                <Card.Body className="p-5">
                                    {/* Post Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-lg shadow-[#1F6F5F]/20 text-lg overflow-hidden">
                                                {post.user?.profile?.profil_picture ? (
                                                    <img src={post.user.profile.profil_picture} alt={post.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    post.user?.name?.[0] || 'U'
                                                )}
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
                                                onClick={(e) => handleLike(e,post?.id)}
                                                count={post.likes_count || 0}
                                                isActive={post.is_liked}
                                                activeClassName="text-red-500 bg-red-50 dark:bg-red-500/10"
                                            />
                                            <ActionIcon
                                                icon={MessageCircle}
                                                onClick={(e) => handleComment(e,post?.id)}
                                                count={post.comments_count || 0}
                                            />
                                            <ActionIcon
                                                icon={Repeat2}
                                                onClick={(e) => handleRepost(e,post?.id)}
                                                count={post.reposts_count || 0}
                                                isActive={post.is_reposted}
                                                activeClassName="text-green-500 bg-green-50 dark:bg-green-500/10"
                                                inactiveClassName="text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <ActionIcon
                                                icon={Bookmark}
                                                onClick={(e) => handleBookmark(e,post?.id)}
                                                count={post.bookmarks_count || 0}
                                                isActive={post.is_bookmarked}
                                                activeClassName="text-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                                inactiveClassName="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                            />
                                            <ActionIcon icon={Share2} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <CommentModal
                show={commentModalOpen}
                onClose={() => {
                    setCommentModalOpen(false);
                    setSelectedPost(null);
                }}
                post={selectedPost}
                user={userLoggedIn}
                onSubmit={submitComment}
                processing={commentProcessing}
            />
        </AuthenticatedLayout>
    );
}
