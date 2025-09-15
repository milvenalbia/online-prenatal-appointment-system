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
        Schema::table('pregnancy_trackings', function (Blueprint $table) {
            // Drop the old 'role' string column
            $table->dropColumn('status');

            $table->enum('pregnancy_status', ['first_trimester', 'second_trimester', 'third_trimester', 'completed'])->default('first_trimester');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
