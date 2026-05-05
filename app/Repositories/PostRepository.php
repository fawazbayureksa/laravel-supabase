<?php

namespace App\Repositories;

use App\Models\Post;

class PostRepository
{
    public function getAll()
    {
        $perPage = 10;
        return Post::with('user')
        ->orderBy('created_at','desc')
        ->paginate($perPage);
    }

    public function getById($id)
    {
        return Post::with('user','comments','likes')->find($id);
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

}