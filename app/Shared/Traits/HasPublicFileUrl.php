<?php

namespace App\Shared\Traits;

trait HasPublicFileUrl
{
    /**
     * Turn a stored relative path (e.g. posts/abc.jpg) into a public URL.
     * Absolute URLs from legacy rows are returned unchanged.
     */
    protected function toPublicUrl(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        return asset('storage/' . ltrim(preg_replace('#^/?storage/#', '', $value), '/'));
    }
}
