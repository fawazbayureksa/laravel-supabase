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
            ->withExists([
                'likes as is_liked' => function ($query) use ($userId) {
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
            ->withExists([
                'likes as is_liked' => function ($query) use ($userId) {
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
        $post = $this->getById($id);
        $post->like(Auth::user());
        return $post;
    }
}
