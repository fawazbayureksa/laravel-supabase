<?php

namespace App\Repositories;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class PostRepository
{
    public function getAll()
    {
        $perPage = 10;
        $userId = Auth::id();

        return Post::with('user')
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
            'user',
            'comments' => function ($query) use ($userId) {
                $query->with('user')
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
        $comment->toggleLike(Auth::user());
        return $comment;
    }

    public function create($data)
    {
        return Post::create($data);
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
        $post->toggleLike(Auth::user());
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

    public function comment(int|null $id,object|array $data)
    {
        $post = Post::findOrFail($id);
        return $post->comments()->create([
            'user_id' => Auth::id(),
            'body' => $data['body'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);
    }

    public function getUserPosts(int|null $userId)
    {
        $currentUserId = Auth::id();

        return Post::query()->where('user_id', '=', $userId)
            ->with('user')
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
