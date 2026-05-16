<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Services\PostService;
use App\Services\UserPreferenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Inertia\Inertia;

class ProfileController extends Controller
{

    /**
     * user preferences service
     * post service
     */
    protected UserPreferenceService $userPreferenceService;
    protected PostService $postService;

    public function __construct(UserPreferenceService $userPreferenceService, PostService $postService)
    {
        $this->userPreferenceService = $userPreferenceService;
        $this->postService = $postService;
    }
    /**
     * Display the user's profile form.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->load('profile');
            $user->loadCount(['followers', 'following']);
        }

        $posts = $this->postService->getUserPosts($user->id);

        return Inertia::render('Profile/index', [
            'user' => $user,
            'posts' => $posts,
        ]);
    }
    public function edit(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->load('profile');
        }

        return Inertia::render('Profile/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        $request->user()->fill($request->validated());
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $this->userPreferenceService->updateProfile($request->user()->id, $request);

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
