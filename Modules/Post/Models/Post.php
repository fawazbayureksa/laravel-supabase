<?php

namespace Modules\Post\Models;

use App\Traits\Likable;
use App\Traits\Bookmarkable;
use App\Traits\Repostable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Post\Models\Comment;
use Modules\Post\Models\PostMedia;
use Modules\Post\Models\Repost;

class Post extends Model
{
    use HasFactory, Likable, Bookmarkable, Repostable;

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function media()
    {
        return $this->hasMany(PostMedia::class);
    }
    public function reposts()
    {
        return $this->hasMany(Repost::class);
    }
}
