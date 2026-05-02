<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Saved posts — bookmarks.
     * Users can organise their saves into named collections (like Instagram's "Save to Collection").
     * If `collection_id` is NULL, the post is saved to the default "All Saved" collection.
     */
    public function up(): void
    {
        // Named bookmark collections (optional feature)
        Schema::create('bookmark_collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->boolean('is_private')->default(true);
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('collection_id')
                  ->nullable()
                  ->constrained('bookmark_collections')
                  ->nullOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'post_id', 'collection_id']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
        Schema::dropIfExists('bookmark_collections');
    }
};
