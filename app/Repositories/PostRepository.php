<?php

namespace App\Repositories;

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
        $userId = Auth::user()->id;
        return Post::with('user', 'likes')
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
            ->find($id);
    }

    public function create($data)
    {
        return Post::create($data);
    }

    public function update($id, $data)
    {
        return Post::find($id)->update($data);
    }

    public function delete($id)
    {
        return Post::find($id)->delete();
    }

    public function like($id)
    {
        $post = Post::findOrFail($id);
        $post->toggleLike(Auth::user());
        return $post;
    }

    public function bookmark($id)
    {
        $post = Post::findOrFail($id);
        $post->toggleBookmark(Auth::user());
        return $post;
    }

    public function repost($id)
    {
        $post = Post::findOrFail($id);
        $post->toggleRepost(Auth::user());
        return $post;
    }

    public function comment($id, $data)
    {
        $post = Post::findOrFail($id);
        return $post->comments()->create([
            'user_id' => Auth::id(),
            'body' => $data['body'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);
    }
}
