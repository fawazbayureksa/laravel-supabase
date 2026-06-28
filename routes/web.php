<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Profile\Http\Controllers\ProfileController;

Route::get('/', [PostController::class, 'index'])->name('index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/showcase', function () {
    return Inertia::render('ComponentShowcase');
})->middleware(['auth'])->name('showcase');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/@{username?}', [ProfileController::class, 'profile'])->name('profile.other.index.');
    Route::post('/profile/follow/@{username}', [ProfileController::class, 'follow'])->name('profile.follow');
    Route::get('/profile-id/', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('profile/upload', [ProfileController::class, 'upload'])->name('profile.upload');

    Route::put('/user/preferences', [UserPreferenceController::class, 'update'])->name('user.preferences.update');
    Route::get('/user/preferences/dark-theme', [UserPreferenceController::class, 'darkThemeUsers'])->name('user.preferences.dark-theme');


    // Post Routes
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('posts', [PostController::class, 'create'])->name('posts.store');
    Route::post('posts/like/{id}', [PostController::class, 'like'])->name('posts.like');
    Route::post('posts/bookmark/{id}', [PostController::class, 'bookmark'])->name('posts.bookmark');
    Route::post('posts/repost/{id}', [PostController::class, 'repost'])->name('posts.repost');
    Route::post('posts/comment/{id}', [PostController::class, 'comment'])->name('posts.comment');
    Route::post('comments/like/{id}', [PostController::class, 'likeComment'])->name('comments.like');

    Route::get('posts/{id}', [PostController::class, 'show'])->name('posts.show');
    Route::get('posts/user/{id}/replies', [PostController::class, 'getUserReplies'])->name('posts.user.replies');

    // Notification Routes
    Route::get('/notifications', [\Modules\Notification\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\Modules\Notification\Http\Controllers\NotificationController::class, 'read'])->name('notifications.read');
    Route::post('/notifications/read-all', [\Modules\Notification\Http\Controllers\NotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::get('/notifications/unread-count', [\Modules\Notification\Http\Controllers\NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
});


require __DIR__ . '/auth.php';
