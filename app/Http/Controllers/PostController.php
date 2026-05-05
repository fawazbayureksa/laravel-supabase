<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    //
    public function index()
    {
        $posts = Post::with('user')->orderBy("created_at", "desc")->paginate(10);
        return Inertia::render('Posts/index', [
            'posts' => $posts,
            'auth' => Auth::user()
        ]);
    }
}
