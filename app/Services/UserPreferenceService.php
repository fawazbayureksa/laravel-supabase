<?php

namespace App\Services;

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
}
