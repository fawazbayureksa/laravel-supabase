<?php

namespace App\Models;

use App\Traits\Likable;
use App\Traits\Bookmarkable;
use App\Traits\Repostable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
