<?php

namespace Modules\Profile\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Modules\Profile\Models\Follow;
use Modules\User\Models\User;

class ProfileService
{
    public function follow(string $username): Follow
    {
        $follower = Auth::user();

        $following = User::where('username', $username)->firstOrFail();

        // Tidak boleh follow diri sendiri
        if ($follower->id === $following->id) {
            throw ValidationException::withMessages([
                'username' => 'You cannot follow yourself.',
            ]);
        }

        $follow = Follow::firstOrCreate(
            [
                'follower_id' => $follower->id,
                'following_id' => $following->id,
            ],
            [
                'status' => 'accepted',
            ]
        );

        return $follow;
    }

    public function unfollow(string $username): bool
    {
        $follower = Auth::user();

        $following = User::where('username', $username)->firstOrFail();

        return Follow::where('follower_id', $follower->id)
            ->where('following_id', $following->id)
            ->delete() > 0;
    }

    public function toggleFollow(string $username): array
    {
        $follower = Auth::user();

        $following = User::where('username', $username)->firstOrFail();

        if ($follower->id === $following->id) {
            throw ValidationException::withMessages([
                'username' => 'You cannot follow yourself.',
            ]);
        }

        $follow = Follow::where('follower_id', $follower->id)
            ->where('following_id', $following->id)
            ->first();

        if ($follow) {
            $follow->delete();

            return [
                'following' => false,
                'message' => 'Unfollowed successfully.',
            ];
        }

        Follow::create([
            'follower_id' => $follower->id,
            'following_id' => $following->id,
            'status' => 'accepted',
        ]);

        return [
            'following' => true,
            'message' => 'Followed successfully.',
        ];
    }
}
