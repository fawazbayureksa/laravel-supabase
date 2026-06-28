<?php

namespace Modules\Notification\Services;

use Illuminate\Database\Eloquent\Model;
use Modules\Notification\Models\Notification;

class NotificationService
{
    public function create(int $userId, int $actorId, string $type, ?Model $notifiable = null, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'actor_id' => $actorId,
            'type' => $type,
            'notifiable_id' => $notifiable?->id,
            'notifiable_type' => $notifiable ? get_class($notifiable) : null,
            'data' => $data,
        ]);
    }

    public function getForUser(int $userId)
    {
        return Notification::with('actor.profile', 'notifiable')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function markAsRead(string $id): void
    {
        Notification::where('id', $id)->update(['read_at' => now()]);
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)->whereNull('read_at')->update(['read_at' => now()]);
    }

    public function unreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)->whereNull('read_at')->count();
    }
}
