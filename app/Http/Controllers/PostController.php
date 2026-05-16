<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use App\Services\PostService;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
            'auth' => Auth::user()->load('profile')
        ]);
    }

    public function like($id)
    {
        $post = $this->postService->like($id);
        return response()->json([
            'post' => $post,
            'is_liked' => $post->likedBy(Auth::user()),
            'likes_count' => $post->likes()->count(),
        ]);
    }

    public function bookmark($id)
    {
        $post = $this->postService->bookmark($id);
        return response()->json([
            'post' => $post,
            'is_bookmarked' => $post->bookmarkedBy(Auth::user()),
            'bookmarks_count' => $post->bookmarks()->count(),
        ]);
    }

    public function repost($id)
    {
        $post = $this->postService->repost($id);
        return response()->json([
            'post' => $post,
            'is_reposted' => $post->repostedBy(Auth::user()),
            'reposts_count' => $post->reposts()->count(),
        ]);
    }

    public function comment(Request $request, $id)
    {
        $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = $this->postService->comment($id, $request->all());
        $post = $comment->post;

        return response()->json([
            'comment' => $comment,
            'comments_count' => $post->comments()->count(),
        ]);
    }

    public function show($id)
    {
        $post = $this->postService->getById($id);
        return Inertia::render('Posts/show', [
            'post' => $post,
            'auth' => Auth::user()
        ]);
    }

    public function likeComment($id)
    {
        $comment = $this->postService->likeComment($id);
        return response()->json([
            'comment' => $comment,
            'is_liked' => $comment->likedBy(Auth::user()),
            'likes_count' => $comment->likes()->count(),
        ]);
    }

    public function create(Request $request)
    {
        $data = $request->all();
        $comment = $this->postService->create($data);
    }
}
