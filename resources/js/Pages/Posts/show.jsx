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
    Image as ImageIcon
} from 'lucide-react';

export default function Show({ post, auth = null }) {
    const [data, setData] = useState(post);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleLike = (id) => {
        const originalPost = { ...data };
        const newIsLiked = !data.is_liked;
        const delta = newIsLiked ? 1 : -1;
        const newLikesCount = Math.max(0, (data.likes_count || 0) + delta);

        setData(prev => ({
            ...prev,
            is_liked: newIsLiked,
            likes_count: newLikesCount
        }));

        axios.post(`/posts/like/${id}`)
            .then((response) => {
                setData(prev => ({
                    ...prev,
                    is_liked: response.data.is_liked,
                    likes_count: response.data.likes_count
                }));
            })
            .catch((error) => {
                console.error("Failed to like post:", error);
                setData(originalPost);
            });
    }

    const handleBookmark = (id) => {
        const originalPost = { ...data };
        const newIsBookmarked = !data.is_bookmarked;
        const delta = newIsBookmarked ? 1 : -1;
        const newBookmarksCount = Math.max(0, (data.bookmarks_count || 0) + delta);

        setData(prev => ({
            ...prev,
            is_bookmarked: newIsBookmarked,
            bookmarks_count: newBookmarksCount
        }));

        axios.post(`/posts/bookmark/${id}`)
            .then((response) => {
                setData(prev => ({
                    ...prev,
                    is_bookmarked: response.data.is_bookmarked,
                    bookmarks_count: response.data.bookmarks_count
                }));
            })
            .catch((error) => {
                console.error("Failed to bookmark post:", error);
                setData(originalPost);
            });
    }

    const handleRepost = (id) => {
        const originalPost = { ...data };
        const newIsReposted = !data.is_reposted;
        const delta = newIsReposted ? 1 : -1;
        const newRepostsCount = Math.max(0, (data.reposts_count || 0) + delta);

        setData(prev => ({
            ...prev,
            is_reposted: newIsReposted,
            reposts_count: newRepostsCount
        }));

        axios.post(`/posts/repost/${id}`)
            .then((response) => {
                setData(prev => ({
                    ...prev,
                    is_reposted: response.data.is_reposted,
                    reposts_count: response.data.reposts_count
                }));
            })
            .catch((error) => {
                console.error("Failed to repost:", error);
                setData(originalPost);
            });
    }

    const handleLikeComment = (commentId) => {
        const commentIndex = data.comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) return;

        const originalComments = [...data.comments];
        const comment = { ...originalComments[commentIndex] };
        const newIsLiked = !comment.is_liked;
        const delta = newIsLiked ? 1 : -1;
        const newLikesCount = Math.max(0, (comment.likes_count || 0) + delta);

        const newComments = [...data.comments];
        newComments[commentIndex] = { ...comment, is_liked: newIsLiked, likes_count: newLikesCount };

        setData(prev => ({ ...prev, comments: newComments }));

        axios.post(`/comments/like/${commentId}`)
            .then((response) => {
                const updatedComments = [...data.comments];
                updatedComments[commentIndex] = {
                    ...updatedComments[commentIndex],
                    is_liked: response.data.is_liked,
                    likes_count: response.data.likes_count
                };
                setData(prev => ({ ...prev, comments: updatedComments }));
            })
            .catch((error) => {
                console.error("Failed to like comment:", error);
                setData(prev => ({ ...prev, comments: originalComments }));
            });
    }

    const handleReply = (target) => {
        setSelectedPost(target);
        setCommentModalOpen(true);
    }

    const submitComment = (body, image = null) => {
        if (!selectedPost) return;
        setProcessing(true);

        const formData = new FormData();
        formData.append('body', body);
        const parentId = selectedPost.id === data.id ? null : selectedPost.id;
        if (parentId) {
            formData.append('parent_id', parentId);
        }
        if (image) {
            formData.append('image', image);
        }

        axios.post(`/posts/comment/${data.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                // If it's a direct reply to the post, add to the main list
                if (!response.data.comment.parent_id) {
                    setData(prev => ({
                        ...prev,
                        comments_count: response.data.comments_count,
                        comments: [response.data.comment, ...prev.comments]
                    }));
                } else {
                    // Update main count and nested count
                    setData(prev => ({
                        ...prev,
                        comments_count: response.data.comments_count,
                        comments: prev.comments.map(c =>
                            c.id === response.data.comment.parent_id
                                ? { ...c, replies_count: (c.replies_count || 0) + 1 }
                                : c
                        )
                    }));
                }
                setCommentModalOpen(false);
                setSelectedPost(null);
            })
            .catch((error) => {
                console.error("Failed to comment:", error);
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Post" />
            <div className="py-8 bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
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
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Thread Discussion</p>
                        </div>
                    </div>

                    {/* Main Post Card */}
                    <Card className="mb-6">
                        <Card.Body className="p-6">
                            {/* Post Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-lg shadow-[#1F6F5F]/20 text-xl">
                                        {data.user?.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight text-lg">
                                            {data.user?.name || 'Anonymous User'}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                            @{data.user?.username || 'anonymous'} • {new Date(data.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">
                                    <MoreHorizontal size={22} />
                                </button>
                            </div>

                            {/* Post Body */}
                            <div className="mb-6">
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-[17px]">
                                    {data.body}
                                </p>
                            </div>

                             {/* Media if any */}
                            {data.media?.length > 0 && (
                                <div className="mb-6 grid grid-cols-1 gap-2 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
                                    {data.media.map((item) => (
                                        <div key={item.id}>
                                            {item.type === 'image' && (
                                                <img src={item.path} className="w-full object-cover max-h-[500px]" alt="" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Stats & Actions */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-50 dark:border-white/4">
                                <div className="flex items-center gap-4 sm:gap-10">
                                    <ActionIcon
                                        icon={Heart}
                                        onClick={() => handleLike(data.id)}
                                        count={data.likes_count || 0}
                                        isActive={data.is_liked}
                                        activeClassName="text-red-500 bg-red-50 dark:bg-red-500/10"
                                        className="scale-110"
                                    />
                                    <ActionIcon
                                        icon={MessageCircle}
                                        onClick={() => handleReply(data)}
                                        count={data.comments_count || 0}
                                        className="scale-110"
                                    />
                                    <ActionIcon
                                        icon={Repeat2}
                                        onClick={() => handleRepost(data.id)}
                                        count={data.reposts_count || 0}
                                        isActive={data.is_reposted}
                                        activeClassName="text-green-500 bg-green-50 dark:bg-green-500/10"
                                        inactiveClassName="text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                                        className="scale-110"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <ActionIcon
                                        icon={Bookmark}
                                        onClick={() => handleBookmark(data.id)}
                                        count={data.bookmarks_count || 0}
                                        isActive={data.is_bookmarked}
                                        activeClassName="text-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                        inactiveClassName="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                        className="scale-110"
                                    />
                                    <ActionIcon icon={Share2} className="scale-110" />
                                </div>
                            </div>

                            {/* <hr></hr> */}
                            <div className="border-b border-gray-200 dark:border-white/4 mt-4"></div>
                            <div className="border-b border-gray-200 dark:border-white/4 mt-8"></div>

                            <div className="space-y-4 mt-2">
                                {data.comments?.length > 0 ? (
                                    data.comments.map((comment) => (
                                        <div key={comment.id} className="transition-all">
                                            <div className="pt-3">
                                                {/* Reply Header */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1F6F5F]/20 to-[#2a917c]/20 flex items-center justify-center text-[#1F6F5F] dark:text-[#2a917c] font-bold text-sm">
                                                            {comment.user?.name?.[0] || 'U'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white leading-tight text-[15px]">
                                                                {comment.user?.name || 'Anonymous User'}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                @{comment.user?.username || 'anonymous'} • {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </div>

                                                {/* Reply Body */}
                                                <div className="mb-2 ml-13">
                                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">
                                                        {comment.body}
                                                    </p>

                                                    {/* Comment Image */}
                                                    {comment.image && (
                                                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 max-w-sm">
                                                            <img 
                                                                src={comment.image} 
                                                                className="w-full h-auto object-cover max-h-[300px]" 
                                                                alt="Comment attachment" 
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Reply Actions */}
                                                <div className="flex justify-between items-center pt-2 mt-4  dark:border-white/4">
                                                    <div className="flex items-center gap-4 sm:gap-8">
                                                        <ActionIcon
                                                            icon={Heart}
                                                            onClick={() => handleLikeComment(comment.id)}
                                                            count={comment.likes_count || 0}
                                                            isActive={comment.is_liked}
                                                            activeClassName="text-red-500 bg-red-50 dark:bg-red-500/10"
                                                        />
                                                        <ActionIcon
                                                            icon={MessageCircle}
                                                            onClick={() => handleReply(comment)}
                                                            count={comment.replies_count || 0}
                                                        />
                                                        <ActionIcon
                                                            icon={Repeat2}
                                                            count={comment.reposts_count || 0}
                                                            inactiveClassName="text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <ActionIcon
                                                            icon={Bookmark}
                                                            inactiveClassName="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                                        />
                                                        <ActionIcon icon={Share2} />
                                                    </div>
                                                </div>
                                                <div className="border-b border-gray-200 dark:border-white/4 mt-0"></div>
                                            </div>
                                        </div>
                                    ))
                                    ) : (
                                    <div className="py-12 text-center bg-white dark:bg-[#1a1a1a] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No replies yet. Be the first to join the conversation!</p>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <CommentModal
                show={commentModalOpen}
                onClose={() => {
                    setCommentModalOpen(false);
                    setSelectedPost(null);
                }}
                post={selectedPost}
                user={auth?.user}
                onSubmit={submitComment}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
