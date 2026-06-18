<?php

namespace Modules\Post\Services;

use Illuminate\Support\Facades\Auth;
use Modules\Post\Repositories\PostRepository;
use Modules\User\Models\User;

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

    public function getById(int $id)
    {
        return $this->postRepository->getById($id);
    }

    public function create(array $data)
    {
        $data['user_id'] = Auth::user()->id;
        return $this->postRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->postRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->postRepository->delete($id);
    }

    public function like(int $id)
    {
        return $this->postRepository->like($id);
    }
    public function likeByUser(int $id, User $user)
    {
        return $this->postRepository->likeByUser($id, $user);
    }

    public function bookmark(int $id)
    {
        return $this->postRepository->bookmark($id);
    }

    public function repost(int $id)
    {
        return $this->postRepository->repost($id);
    }

    public function comment(int $id, array $data)
    {
        return $this->postRepository->comment($id, $data);
    }
    public function commentByUser(int $id, int $userId, array|object $data)
    {
        return $this->postRepository->commentByPostAndUserId($id, $userId, $data);
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
    public function likeComment(int $id)
    {
        return $this->postRepository->likeComment($id);
    }

    public function getUserPosts(int $userId)
    {
        return $this->postRepository->getUserPosts($userId);
    }

    public function getUserReposts(int $userId)
    {
        return $this->postRepository->getUserReposts($userId);
    }

    public function getUserReplies(int $userId)
    {
        return $this->postRepository->getUserReplies($userId);
    }

    public function getUserMedia(int $userId)
    {
        return $this->postRepository->getUserMedia($userId);
    }
    public function postLike(int $id)
    {
        return $this->postRepository->like($id);
    }
}
