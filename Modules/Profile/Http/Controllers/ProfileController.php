<?php

namespace Modules\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Services\PostService;
use App\Services\ProfileService;
use App\Services\UserPreferenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Modules\User\Models\User;

class ProfileController extends Controller
{

    /**
     * user preferences service
     * post service
     */
    protected UserPreferenceService $userPreferenceService;
    protected PostService $postService;
    protected ProfileService $profileService;

    public function __construct(UserPreferenceService $userPreferenceService, PostService $postService, ProfileService $profileService)
    {
        $this->userPreferenceService = $userPreferenceService;
        $this->postService = $postService;
        $this->profileService = $profileService;
    }
    /**
     * Display the user's profile form.
     */
    public function index(Request $request, string|null $username)
    {
        $user = Auth::user();
        $auth = null;

        if (!empty($username)) {
            $auth = Auth::user();
            $user = User::where('username', $username)->first();
        }

        if ($user) {
            $user->load('profile');
            $user->loadCount(['followers', 'following']);
        }

        $posts = $this->postService->getUserPosts($user->id);
        $reposts = $this->postService->getUserReposts($user->id);
        $replies = $this->postService->getUserReplies($user->id);
        $media = $this->postService->getUserMedia($user->id);

        return Inertia::render('Profile/index', [
            'auth' => $auth,
            'user' => $user,
            'posts' => $posts,
            'reposts' => $reposts,
            'replies' => $replies,
            'media' => $media,
        ]);
    }
    public function edit(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user = User::where('id', $user->id)->with('profile')->first();
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

    // upload image profile
    public function upload(Request $request)
    {
        return $this->userPreferenceService->upload($request);
    }

    public function follow(string $username)
    {
        return $this->profileService->follow($username);
    }
}
