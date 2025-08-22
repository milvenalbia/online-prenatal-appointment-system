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
        Schema::create('immuzition_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id');
            $table->foreignId('tetanus_vaccine_id')->nullbale();
            $table->foreignId('covid_vaccine_id')->nullable();
            $table->foreignId('other_vaccine_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('immuzition_records');
    }
};
