<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrenatalVisit extends Model
{
    protected $fillable = [
        'patient_id',
        'attending_physician',
        'date',
        'temp',
        'weight',
        'rr',
        'pr',
        'two_sat',
        'bp',
        'fht',
        'fh',
        'aog',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
