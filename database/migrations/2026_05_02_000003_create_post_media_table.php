<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Stores media attachments for posts (images / videos).
     * A single post can have multiple media files (e.g. a carousel of images).
     * `order_column` preserves the display order chosen by the author.
     * `thumbnail_path` is used for videos so a preview frame can be shown.
     */
    public function up(): void
    {
        Schema::create('post_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['image', 'video']);
            $table->string('path');                        // Storage path / URL
            $table->string('thumbnail_path')->nullable();  // Video thumbnail
            $table->string('alt_text')->nullable();        // Accessibility description
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable(); // For videos
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->unsignedTinyInteger('order_column')->default(0);
            $table->timestamps();

            $table->index(['post_id', 'order_column']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_media');
    }
};
