<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', [PostController::class, 'index'])->name('index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/showcase', function () {
    return Inertia::render('ComponentShowcase');
})->middleware(['auth'])->name('showcase');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/{id}', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::put('/user/preferences', [UserPreferenceController::class, 'update'])->name('user.preferences.update');
    Route::get('/user/preferences/dark-theme', [UserPreferenceController::class, 'darkThemeUsers'])->name('user.preferences.dark-theme');


    // Post Routes
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('posts/like/{id}', [PostController::class, 'like'])->name('posts.like');
    Route::post('posts/bookmark/{id}', [PostController::class, 'bookmark'])->name('posts.bookmark');
    Route::post('posts/repost/{id}', [PostController::class, 'repost'])->name('posts.repost');
    Route::post('posts/comment/{id}', [PostController::class, 'comment'])->name('posts.comment');
    Route::post('comments/like/{id}', [PostController::class, 'likeComment'])->name('comments.like');

    Route::get('posts/{id}', [PostController::class, 'show'])->name('posts.show');
});

require __DIR__ . '/auth.php';
