<?php

namespace App\Services;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Profile;
use App\Models\User;

class UserPreferenceService
{
    /**
     * Update user preferences.
     */
    public function updatePreferences(User $user, array $preferences): User
    {
        $currentPreferences = $user->preferences ?? [];

        // Merge new preferences with existing ones
        $updatedPreferences = array_merge($currentPreferences, $preferences);

        $user->update([
            'preferences' => $updatedPreferences,
        ]);

        return $user;
    }

    /**
     * Get users by a specific preference.
     */
    public function getUsersByPreference(string $key, mixed $value)
    {
        return User::where("preferences->$key", $value)->get();
    }

    public function updateProfile(int $user_id, ProfileUpdateRequest $request)
    {
        $profile = Profile::where('user_id', $request->user()->id)->first();

        if (!$profile) {
            $profile = new Profile();
            $profile->create([
                'user_id' => $request->user()->id,
                'phone'   => $request->input('phone'),
                'address' => $request->input('address')
            ]);
        } else {
            $profile->update([
                'phone'   => $request->input('phone'),
                'address' => $request->input('address')
            ]);
        }
    }
}
