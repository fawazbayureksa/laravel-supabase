<?php

namespace App\Models;

use App\Shared\Traits\HasPublicFileUrl;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostMedia extends Model
{
    use HasFactory, HasPublicFileUrl;

    protected $guarded = ['id'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function getPathAttribute(?string $value): ?string
    {
        return $this->toPublicUrl($value);
    }
}
