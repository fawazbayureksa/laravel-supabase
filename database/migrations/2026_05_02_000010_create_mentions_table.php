<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Mention records linking posts/comments to mentioned users.
     * While mentions can be parsed from post body text, storing them explicitly:
     *   - enables fast notifications (no regex scan on every notification check)
     *   - allows querying "all posts that mention @user" efficiently
     */
    public function up(): void
    {
        Schema::create('mentions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();   // mentioned user
            $table->morphs('mentionable'); // mentionable_type + mentionable_id (Post or Comment)
            $table->timestamps();

            $table->unique(['user_id', 'mentionable_id', 'mentionable_type']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentions');
    }
};
