<?php

namespace Modules\Post\Repositories;

use Modules\Notification\Services\NotificationService;
use Modules\Post\Models\Post;
use Modules\Post\Models\Comment;
use Modules\Post\Models\Repost;
use Modules\User\Models\User;
use Illuminate\Support\Facades\Auth;

class PostRepository
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    public function getAll()
    {
        $perPage = 100;
        $userId = Auth::id();

        return Post::with(['user.profile', 'media'])
            ->withCount(['likes', 'comments', 'reposts', 'bookmarks'])
            ->withExists([
                'likes as is_liked' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'bookmarks as is_bookmarked' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'reposts as is_reposted' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getById($id)
    {
        $userId = Auth::id();
        return Post::with([
            'user.profile',
            'media',
            'comments' => function ($query) use ($userId) {
                $query->with('user.profile')
                    ->withCount(['likes', 'replies'])
                    ->withExists([
                        'likes as is_liked' => function ($q) use ($userId) {
                            $q->where('user_id', $userId);
                        }
                    ])
                    ->orderBy('created_at', 'asc');
            }
        ])
            ->withCount(['likes', 'comments', 'reposts', 'bookmarks'])
            ->withExists([
                'likes as is_liked' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'bookmarks as is_bookmarked' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'reposts as is_reposted' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            ])
            ->findOrFail($id);
    }

    public function likeComment($id)
    {
        $comment = Comment::findOrFail($id);
        $liked = $comment->toggleLike(Auth::user());
        if ($liked && $comment->user_id !== Auth::id()) {
            $this->notificationService->create(
                $comment->user_id, Auth::id(), 'like', $comment->post ?? $comment,
                ['post_excerpt' => substr($comment->body ?? '', 0, 100)]
            );
        }
        return $comment;
    }

    public function create($data)
    {
        $post = Post::create([
            'user_id' => $data['user_id'],
            'body' => $data['body'] ?? null,
            'thread_id' => $data['thread_id'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'visibility' => $data['visibility'] ?? 'public',
        ]);

        if (isset($data['media_path'])) {
            $post->media()->create([
                'type' => $data['media_type'] ?? 'image',
                'path' => $data['media_path'],
            ]);
        }

        return $post->load(['user.profile', 'media']);
    }

    public function update($id, $data)
    {
        // return Post::find($id)->update($data);
    }

    public function delete($id)
    {
        // return Post::find($id)->delete();
    }

    public function like(int|null $id)
    {
        $post = Post::findOrFail($id);
        $liked = $post->toggleLike(Auth::user());
        if ($liked && $post->user_id !== Auth::id()) {
            $this->notificationService->create(
                $post->user_id, Auth::id(), 'like', $post,
                ['post_excerpt' => substr($post->body ?? '', 0, 100)]
            );
        }
        return $post;
    }
    public function likeByUser(int|null $id, User $user)
    {
        $post = Post::findOrFail($id);
        $post->toggleLike($user);
        return $post;
    }

    public function bookmark(int|null $id)
    {
        $post = Post::findOrFail($id);
        $post->toggleBookmark(Auth::user());
        return $post;
    }

    public function repost(int|null $id)
    {
        $post = Post::findOrFail($id);
        $post->toggleRepost(Auth::user());
        return $post;
    }

    public function comment(int|null $id, object|array $data)
    {
        $post = Post::findOrFail($id);
        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'body' => $data['body'],
            'parent_id' => $data['parent_id'] ?? null,
            'image' => $data['image'] ?? null,
        ]);
        if ($post->user_id !== Auth::id()) {
            $type = $comment->parent_id ? 'reply' : 'comment';
            $this->notificationService->create(
                $post->user_id, Auth::id(), $type, $post,
                ['post_excerpt' => substr($post->body ?? '', 0, 100)]
            );
        }
        return $comment;
    }

    public function commentByPostAndUserId(int|null $id, int|null $user_id, object|array $data)
    {
        $post = Post::findOrFail($id);
        return $post->comments()->create([
            'user_id' => $user_id,
            'body' => $data['body'],
            'parent_id' => $data['parent_id'] ?? null,
            'image' => $data['image'] ?? null,
        ]);
    }

    public function getUserPosts(int|null $userId)
    {
        $currentUserId = Auth::id();

        return Post::query()->where('user_id', '=', $userId)
            ->with(['user.profile', 'media'])
            ->withCount(['likes', 'comments', 'reposts', 'bookmarks'])
            ->withExists([
                'likes as is_liked' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                },
                'bookmarks as is_bookmarked' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                },
                'reposts as is_reposted' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUserReposts(int|null $userId)
    {
        $currentUserId = Auth::id();
        return Repost::query()->where('user_id', '=', $userId)
            ->whereHas('post')
            ->with([
                'post.user.profile',
                'post.media',
                'post' => function ($query) use ($currentUserId) {
                    $query->withCount(['likes', 'comments', 'reposts', 'bookmarks'])
                        ->withExists([
                            'likes as is_liked' => function ($q) use ($currentUserId) {
                                $q->where('user_id', '=', $currentUserId);
                            },
                            'bookmarks as is_bookmarked' => function ($q) use ($currentUserId) {
                                $q->where('user_id', '=', $currentUserId);
                            },
                            'reposts as is_reposted' => function ($q) use ($currentUserId) {
                                $q->where('user_id', '=', $currentUserId);
                            }
                        ]);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUserReplies(int|null $userId)
    {
        $currentUserId = Auth::id();
        return Comment::query()->where('user_id', '=', $userId)
            ->whereHas('post')
            ->with([
                'post.user.profile',
                'post.media',
                'user.profile',
                'post'
            ])
            ->withCount(['likes', 'replies'])
            ->withExists([
                'likes as is_liked' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUserMedia(int|null $userId)
    {
        $currentUserId = Auth::id();
        return Post::query()->where('user_id', '=', $userId)
            ->whereHas('media')
            ->with(['user.profile', 'media'])
            ->withCount(['likes', 'comments', 'reposts', 'bookmarks'])
            ->withExists([
                'likes as is_liked' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                },
                'bookmarks as is_bookmarked' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                },
                'reposts as is_reposted' => function ($query) use ($currentUserId) {
                    $query->where('user_id', '=', $currentUserId);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
