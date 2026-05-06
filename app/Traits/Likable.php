<?php

namespace App\Traits;

use App\Models\Like;
use App\Models\User;

trait Likable
{
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function likedBy(User $user): bool
    {
        return $this->likes()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function like(User $user): void
    {
        $this->likes()->firstOrCreate([
            'user_id' => $user->id,
        ]);
    }

    public function unlike(User $user): void
    {
        $this->likes()
            ->where('user_id', $user->id)
            ->delete();
    }

    public function toggleLike(User $user): bool
    {
        if ($this->likedBy($user)) {
            $this->unlike($user);

            return false;
        }

        $this->like($user);

        return true;
    }
}