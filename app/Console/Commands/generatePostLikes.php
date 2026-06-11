<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Repositories\PostRepository;
use App\Services\PostService;
use Illuminate\Console\Command;

class generatePostLikes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-post-likes {post_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    // public function __construct(PostService $postService)
    // {
    //     $this->postService = $postService;
    // }

    public function handle()
    {
        $id = (int) $this->argument('post_id') ?? null;
        $users =  User::get()->pluck('id');

        $postService = new PostService(new PostRepository());
        foreach ($users as $item) {
            $user = User::where('id', $item)->first();
            $postService->likeByUser($id, $user);
        }

        $this->info('Success');
    }
}
