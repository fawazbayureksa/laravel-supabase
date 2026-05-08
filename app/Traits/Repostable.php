<?php

namespace App\Traits;

use App\Models\Repost;
use App\Models\User;

trait Repostable
{
    public function reposts()
    {
        return $this->hasMany(Repost::class);
    }

    public function repostedBy(User $user): bool
    {
        return $this->reposts()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function repost(User $user): void
    {
        $this->reposts()->firstOrCreate([
            'user_id' => $user->id,
        ]);
    }

    public function unrepost(User $user): void
    {
        $this->reposts()
            ->where('user_id', $user->id)
            ->delete();
    }

    public function toggleRepost(User $user): bool
    {
        if ($this->repostedBy($user)) {
            $this->unrepost($user);
            return false;
        }

        $this->repost($user);
        return true;
    }
}
