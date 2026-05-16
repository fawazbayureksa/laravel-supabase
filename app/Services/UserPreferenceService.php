<?php

namespace App\Services;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            $profile = Profile::create([
                'user_id' => $request->user()->id,
                'phone'   => $request->input('phone'),
                'address' => $request->input('address'),
                'bio'     => $request->input('bio'),
            ]);
        } else {
            $profile->update([
                'phone'   => $request->input('phone'),
                'address' => $request->input('address'),
                'bio'     => $request->input('bio'),
            ]);
        }
    }

    // upload image profile
    public function upload($request)
    {
        $request->validate([
            'profil_picture' => 'required|image|max:20000',
        ]);

        $image = $request->file('profil_picture');
        $path = $image->store('profil_picture', 'public');
        $url = asset('storage/' . $path);

        $user = Auth::user();
        Profile::updateOrCreate(
            ['user_id' => $user->id],
            ['profil_picture' => $url]
        );

        return back()->with('success', 'Image uploaded successfully!');
    }
}
