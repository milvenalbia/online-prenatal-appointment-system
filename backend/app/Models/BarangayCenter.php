<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BarangayCenter extends Model
{
    protected $fillable = [
        'health_station',
        'rural_health_unit',
        'region',
        'province',
        'municipality',
        'barangay',
    ];

    public function midwives(): HasMany
    {
        return $this->hasMany(Midwife::class);
    }

    public function barangay_workers(): HasMany
    {
        return $this->hasMany(BarangayWorker::class);
    }

    public function pregnancy_trackings(): HasMany
    {
        return $this->hasMany(PregnancyTracking::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region');
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province');
    }

    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class, 'municipality');
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay');
    }
}
