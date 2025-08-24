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
        Schema::create('pregnancy_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained('patients');
            $table->foreignId('barangay_center_id')->nullable()->constrained('barangay_centers');
            $table->foreignId('barangay_worker_id')->nullable()->constrained('barangay_workers');
            $table->foreignId('midwife_id')->nullable()->constrained('midwives');
            $table->string('fullname');
            $table->integer('age');
            $table->string('gravidity')->nullable();
            $table->string('parity')->nullable();
            $table->string('lmp')->nullable();
            $table->string('edc')->nullable();
            $table->string('birthing_center')->nullable();
            $table->string('birthing_center_address')->nullable();
            $table->string('referral_center')->nullable();
            $table->string('referral_center_address')->nullable();
            $table->string('barangay_health_station')->nullable();
            $table->string('rural_health_unit')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregnancy_trackings');
    }
};
