<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Reposts (aka "quote posts" or plain reposts).
     *
     * type:
     *   'repost'       — simple re-share with no added text (like a retweet)
     *   'quote'        — re-share with the author's own comment on top
     *
     * For a 'quote' repost, a new Post record is created that references
     * the original via `quoted_post_id` on the posts table, so the repost
     * itself can have media, body text, likes, etc. of its own.
     *
     * For a plain 'repost', we only insert a row in this table so we can
     * display it on the user's profile/feed without duplicating the post.
     */
    public function up(): void
    {
        // Add quoted_post_id to posts so a quote-post can reference the original
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('quoted_post_id')->nullable()->after('parent_id');
            $table->foreign('quoted_post_id')->references('id')->on('posts')->nullOnDelete();
        });

        Schema::create('reposts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete(); // original post
            $table->enum('type', ['repost', 'quote'])->default('repost');
            $table->timestamps();

            $table->unique(['user_id', 'post_id']); // can only repost once
            $table->index('post_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reposts');

        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['quoted_post_id']);
            $table->dropColumn('quoted_post_id');
        });
    }
};
