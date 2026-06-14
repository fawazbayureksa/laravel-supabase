<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Repositories\PostRepository;
use App\Services\PostService;
use Illuminate\Console\Command;

class GeneratePostComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-post-comments {post_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $comments = [
            'Great post! 👍',
            'Thanks for sharing.',
            'Interesting perspective.',
            'I completely agree.',
            'This is very helpful.',
            'Nice content!',
            'Keep up the good work.',
            'Well explained.',
            'Love this post ❤️',
            'Very informative.',
        ];

        $id = (int) $this->argument('post_id') ?? null;
        $users =  User::get()->pluck('id');

        $postService = new PostService(new PostRepository());
        foreach ($users as $item) {
            $data = [
                'body' => $comments[array_rand($comments)],
                // 'parent_id' => $id,
            ];
            $postService->commentByUser($id, $item, $data);
        }

        $this->info('Success');
    }
}
