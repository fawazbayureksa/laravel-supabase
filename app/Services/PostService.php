<?php

namespace App\Services;

use App\Repositories\PostRepository;

class PostService
{
    protected $postRepository;

    public function __construct(PostRepository $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function getAll()
    {
        return $this->postRepository->getAll();
    }

    public function getById($id)
    {
        return $this->postRepository->getById($id);
    }

    public function create($data)
    {
        return $this->postRepository->create($data);
    }

    public function update($id, $data)
    {
        return $this->postRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->postRepository->delete($id);
    }

    public function like($id)
    {
        return $this->postRepository->like($id);
    }

    public function bookmark($id)
    {
        return $this->postRepository->bookmark($id);
    }

    public function repost($id)
    {
        return $this->postRepository->repost($id);
    }

    public function comment($id, $data)
    {
        return $this->postRepository->comment($id, $data);
    }

    // public function unlike($id)
    // {
    //     return $this->postRepository->unlike($id);
    // }

    // public function getUserPost($id)
    // {
    //     return $this->postRepository->getUserPost($id);
    // }

    // public function getUserComment($id)
    // {
    //     return $this->postRepository->getUserComment($id);
    // }

    // public function getUserLike($id)
    // {
    //     return $this->postRepository->getUserLike($id);
    // }

    // public function getUserFollower($id)
    // {
    //     return $this->postRepository->getUserFollower($id);
    // }

    // public function getUserFollowing($id)
    // {
    //     return $this->postRepository->getUserFollowing($id);
    // }
}
