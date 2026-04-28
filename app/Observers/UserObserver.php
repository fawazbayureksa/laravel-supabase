<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Profile;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $user->profile()->create([
            'phone' => null,
            'address' => null,
        ]);
        
        // Also initialize default preferences
        $user->update([
            'preferences' => [
                'theme' => 'light',
                'notifications' => true,
            ],
        ]);
    }
}
