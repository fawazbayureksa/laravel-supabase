<?php

namespace Modules\Notification\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\Notification\Services\NotificationService;

class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index()
    {
        $user = Auth::user();
        $notifications = $this->notificationService->getForUser($user->id);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function read(string $id)
    {
        $this->notificationService->markAsRead($id);
        return response()->json(['success' => true]);
    }

    public function readAll()
    {
        $this->notificationService->markAllAsRead(Auth::id());
        return response()->json(['success' => true]);
    }

    public function unreadCount()
    {
        return response()->json([
            'count' => $this->notificationService->unreadCount(Auth::id()),
        ]);
    }
}
