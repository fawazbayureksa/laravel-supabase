<?php

namespace App\Http\Controllers;

use App\Services\UserPreferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    public function __construct(
        protected UserPreferenceService $preferenceService
    ) {}

    /**
     * Update user preferences.
     */
    public function update(Request $request)
    {
        $request->validate([
            'theme' => 'string|in:light,dark',
            'notifications' => 'sometimes',
        ]);

        $data = [
            'theme' => $request->theme,
            'notifications' => $request->boolean('notifications'),
        ];

        $user = $this->preferenceService->updatePreferences(Auth::user(), $data);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Preferences updated successfully',
                'preferences' => $user->preferences,
            ]);
        }

        return back()->with('status', 'preferences-updated');
    }

    /**
     * Example query: Get users with dark theme.
     */
    public function darkThemeUsers(): JsonResponse
    {
        $users = $this->preferenceService->getUsersByPreference('theme', 'dark');

        return response()->json($users);
    }
}
