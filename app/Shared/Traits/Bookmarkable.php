<?php

namespace App\Traits;

use App\Models\Bookmark;
use App\Models\User;

trait Bookmarkable
{
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function bookmarkedBy(User $user): bool
    {
        return $this->bookmarks()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function bookmark(User $user): void
    {
        $this->bookmarks()->firstOrCreate([
            'user_id' => $user->id,
        ]);
    }

    public function unbookmark(User $user): void
    {
        $this->bookmarks()
            ->where('user_id', $user->id)
            ->delete();
    }

    public function toggleBookmark(User $user): bool
    {
        if ($this->bookmarkedBy($user)) {
            $this->unbookmark($user);
            return false;
        }

        $this->bookmark($user);
        return true;
    }
}
