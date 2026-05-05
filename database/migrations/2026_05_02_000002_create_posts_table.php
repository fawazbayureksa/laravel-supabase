<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Core posts table. A "thread" is a chain of posts linked via:
     *   - thread_id  : the ID of the root/first post in a thread chain
     *   - parent_id  : the immediate previous post this one continues from
     *
     * A single standalone post has thread_id = NULL and parent_id = NULL.
     * The first post of a continued thread has thread_id = its own ID.
     * Subsequent continuations have thread_id = root post ID, parent_id = previous post ID.
     *
     * visibility:
     *   'public'    — anyone can see
     *   'followers' — only followers
     *   'private'   — only the author
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Thread chain — nullable for standalone posts
            $table->unsignedBigInteger('thread_id')->nullable()->index();
            $table->unsignedBigInteger('parent_id')->nullable()->index();

            $table->text('body')->nullable();                            // Text content (nullable if media-only)
            $table->enum('visibility', ['public', 'followers', 'private'])->default('public');

            // Denormalised counts for fast retrieval (updated via observers/events)
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->unsignedInteger('reposts_count')->default(0);
            $table->unsignedInteger('saves_count')->default(0);
            $table->unsignedInteger('views_count')->default(0);

            $table->boolean('is_edited')->default(false);
            $table->softDeletes();
            $table->timestamps();

            // Self-referential FK for thread chain
            $table->foreign('thread_id')->references('id')->on('posts')->nullOnDelete();
            $table->foreign('parent_id')->references('id')->on('posts')->nullOnDelete();

            $table->index(['user_id', 'created_at']);
            $table->index(['thread_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
