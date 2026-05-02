<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')->nullable();
            $table->string('current_device')->nullable();
            $table->boolean('is_private')->default(0)->nullable();
            $table->boolean('is_active')->default(1)->nullable();
            $table->string('username')->nullable();
        });

        Schema::table('profiles', function (Blueprint $table) {
            $table->string('profil_picture')->nullable();
            $table->string('bio')->nullable();
            $table->date('birth_of_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->dropColumn('last_login_at');
            $table->dropColumn('current_device');
            $table->dropColumn('is_private');
            $table->dropColumn('is_active');
            $table->dropColumn('username');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('profil_picture');
            $table->dropColumn('bio');
            $table->dropColumn('birth_of_date');
        });
    }
};
