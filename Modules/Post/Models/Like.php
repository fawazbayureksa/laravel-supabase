<?php

namespace Modules\Post\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;

class Like extends Model
{
    //
    protected $fillable = [
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likeable()
    {
        return $this->morphTo();
    }
}
