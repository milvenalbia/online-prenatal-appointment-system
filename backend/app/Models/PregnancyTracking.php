<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PregnancyTracking extends Model
{
    protected $fillable = [
        'patient_id',
        'barangay_center_id',
        'barangay_worker_id',
        'midwife_id',
        'fullname',
        'age',
        'gravidity',
        'parity',
        'lmp',
        'edc',
        'birthing_center',
        'birthing_center_address',
        'referral_center',
        'referral_center_address',
        'barangay_health_station',
        'rural_unit',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function barangay_center(): BelongsTo
    {
        return $this->belongsTo(BarangayCenter::class);
    }

    public function midwife(): BelongsTo
    {
        return $this->belongsTo(Midwife::class);
    }

    public function barangay_worker(): BelongsTo
    {
        return $this->belongsTo(Midwife::class);
    }
}
