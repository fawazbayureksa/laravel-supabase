<?php

namespace Modules\Profile\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    //
    protected $table = 'follows';
    protected $guarded = ['id'];
}
