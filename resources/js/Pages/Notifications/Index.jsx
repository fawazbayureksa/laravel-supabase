import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Heart, MessageCircle, Repeat2, Share2,
    Bell, ChevronDown, Ellipsis, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

function Avatar({ src, name, size = "sm" }) {
    const sizes = { sm: "w-9 h-9 text-sm", md: "w-10 h-10 text-base", lg: "w-11 h-11 text-lg" };
    return (
        <div className={cn("rounded-full bg-[#1F6F5F] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden", sizes[size])}>
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                name?.charAt(0)?.toUpperCase() || "?"
            )}
        </div>
    );
}

function ActionRow({ likesCount, commentsCount, repostsCount, postId }) {
    const [local, setLocal] = useState({ likes: likesCount, comments: commentsCount, reposts: repostsCount });
    const [loading, setLoading] = useState(null);

    const act = (action, routeName) => {
        setLoading(action);
        router.post(route(routeName, postId), {}, { preserveScroll: true, onFinish: () => setLoading(null) });
    };

    return (
        <div className="flex items-center gap-6 mt-3 text-gray-400">
            <button onClick={() => act("like", "posts.like")} disabled={loading === "like"} className="flex items-center gap-1.5 text-sm hover:text-red-500 transition-colors">
                {loading === "like" ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
                {local.likes > 0 && <span className="text-xs font-semibold">{local.likes}</span>}
            </button>
            <button onClick={() => router.visit(route("posts.show", postId))} className="flex items-center gap-1.5 text-sm hover:text-blue-500 transition-colors">
                <MessageCircle size={16} />
                {local.comments > 0 && <span className="text-xs font-semibold">{local.comments}</span>}
            </button>
            <button onClick={() => act("repost", "posts.repost")} disabled={loading === "repost"} className="flex items-center gap-1.5 text-sm hover:text-emerald-500 transition-colors">
                {loading === "repost" ? <Loader2 size={16} className="animate-spin" /> : <Repeat2 size={16} />}
                {local.reposts > 0 && <span className="text-xs font-semibold">{local.reposts}</span>}
            </button>
            <button className="flex items-center gap-1.5 text-sm hover:text-[#1F6F5F] transition-colors">
                <Share2 size={16} />
            </button>
        </div>
    );
}

export default function Index({ notifications }) {
    const [following, setFollowing] = useState({});

    const toggleFollow = (username) => {
        setFollowing((prev) => ({ ...prev, [username]: true }));
        router.post(route("profile.follow", username), {}, {
            preserveScroll: true,
            onFinish: () => setFollowing((prev) => ({ ...prev, [username]: false })),
        });
    };

    return (
        <div className="max-w-lg mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pt-2">
                <div className="flex items-center gap-1.5">
                    <h1 className="text-xl font-bold text-[#1a1a1a] dark:text-white">Activity</h1>
                    <ChevronDown size={18} className="text-gray-400" />
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <Ellipsis size={18} className="text-gray-500" />
                </button>
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <Bell size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold text-sm">No activity yet</p>
                </div>
            )}

            {/* Container */}
            <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/6 overflow-hidden">
                {notifications.map((n, idx) => {
                    const actor = n.actor;
                    const data = n.data || {};
                    const isPostType = ["like", "comment", "reply", "repost"].includes(n.type);

                    return (
                        <div key={n.id}>
                            {idx > 0 && <div className="mx-5 h-px bg-gray-100 dark:bg-white/5" />}

                            <div className={cn("px-5 py-4", !n.read_at && "bg-[#1F6F5F]/[0.03]")}>
                                {/* Suggested thread card */}
                                {isPostType && (
                                    <div>
                                        <div className="flex items-start gap-3">
                                            <Link href={route("profile.other.index.", actor?.username)}>
                                                <Avatar src={actor?.profile?.profil_picture} name={actor?.name} />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <Link href={route("profile.other.index.", actor?.username)} className="font-bold text-sm text-[#1a1a1a] dark:text-white hover:underline truncate">
                                                        {actor?.name}
                                                    </Link>
                                                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.created_at)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {n.type === "like" && "liked your thread"}
                                                    {n.type === "comment" && "replied to your thread"}
                                                    {n.type === "reply" && "replied to your comment"}
                                                    {n.type === "repost" && "reposted your thread"}
                                                </p>

                                                {/* Post body preview */}
                                                {data.post_body && (
                                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <Avatar src={data.post_user_avatar} name={data.post_user_name} size="sm" />
                                                            <span className="font-bold text-xs text-[#1a1a1a] dark:text-white truncate">{data.post_user_name}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                                                            {data.post_body}
                                                        </p>
                                                    </div>
                                                )}

                                                <ActionRow
                                                    likesCount={data.likes_count ?? 0}
                                                    commentsCount={data.comments_count ?? 0}
                                                    repostsCount={data.reposts_count ?? 0}
                                                    postId={n.notifiable_id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Follow notification */}
                                {n.type === "follow" && (
                                    <div className="flex items-start gap-3">
                                        <Link href={route("profile.other.index.", actor?.username)}>
                                            <Avatar src={actor?.profile?.profil_picture} name={actor?.name} />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <Link href={route("profile.other.index.", actor?.username)} className="font-bold text-sm text-[#1a1a1a] dark:text-white hover:underline truncate">
                                                    {actor?.name}
                                                </Link>
                                                <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.created_at)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">followed you</p>
                                        </div>
                                        <button
                                            onClick={() => toggleFollow(actor?.username)}
                                            disabled={following[actor?.username]}
                                            className="shrink-0 px-4 py-1.5 rounded-full border border-gray-300 dark:border-white/15 text-sm font-bold text-[#1a1a1a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                                        >
                                            {following[actor?.username] ? "Following" : "Follow"}
                                        </button>
                                    </div>
                                )}

                                {/* Follow suggestion */}
                                {n.type === "follow_suggestion" && (
                                    <div className="flex items-start gap-3">
                                        <Link href={route("profile.other.index.", actor?.username)}>
                                            <Avatar src={actor?.profile?.profil_picture} name={actor?.name} />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <Link href={route("profile.other.index.", actor?.username)} className="font-bold text-sm text-[#1a1a1a] dark:text-white hover:underline truncate">
                                                    {actor?.name}
                                                </Link>
                                                <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.created_at)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Suggested for you</p>
                                        </div>
                                    </div>
                                )}

                                {/* System notification */}
                                {n.type === "system" && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                                            <Bell size={16} className="text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{data.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
