<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Notification system.
     *
     * `type` examples:
     *   'like'           — someone liked your post/comment
     *   'comment'        — someone commented on your post
     *   'reply'          — someone replied to your comment
     *   'follow'         — someone followed you
     *   'follow_request' — someone requested to follow you (private account)
     *   'repost'         — someone reposted your post
     *   'quote'          — someone quote-posted your post
     *   'mention'        — someone mentioned you in a post/comment
     *
     * `notifiable_type` / `notifiable_id` — polymorphic: the related model
     *   (e.g. Post, Comment, Follow) that triggered the notification.
     *
     * `read_at` — NULL means unread.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();      // recipient
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete(); // who triggered it
            $table->string('type');                                               // notification kind
            $table->nullableMorphs('notifiable');                                 // related model
            $table->json('data')->nullable();                                     // extra payload (e.g. post excerpt)
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
