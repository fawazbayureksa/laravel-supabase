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
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theme' => 'string|in:light,dark',
            'notifications' => 'boolean',
        ]);

        $user = $this->preferenceService->updatePreferences(Auth::user(), $validated);

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $user->preferences,
        ]);
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
