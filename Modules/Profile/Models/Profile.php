<?php

namespace Modules\Profile\Models;

use App\Shared\Traits\HasPublicFileUrl;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\User\Models\User;

class Profile extends Model
{
    use HasFactory, HasUuids, HasPublicFileUrl;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'bio',
        'profil_picture',
        'birth_of_date',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Stored path (e.g. profil_picture/abc.jpg) -> public URL.
     * Full URLs from old rows are returned as-is.
     */
    public function getProfilPictureAttribute(?string $value): ?string
    {
        return $this->toPublicUrl($value);
    }
}
