<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use App\Services\PostService;
use Inertia\Inertia;

class PostController extends Controller
{
    //
    protected $postService;
    public function __construct(PostService $postService)
    {
       $this->postService = $postService;
    }

    public function index()
    {
        $posts = $this->postService->getAll();
        return Inertia::render('Posts/index', [
            'posts' => $posts,
            'auth' => Auth::user()
        ]);
    }
}
