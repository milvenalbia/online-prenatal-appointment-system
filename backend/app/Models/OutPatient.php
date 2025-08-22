<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutPatient extends Model
{
    protected $fillable = [
        'patient_id',
        'file_number',
        'date',
        'time',
        'temp',
        'height',
        'weight',
        'rr',
        'pr',
        'two_sat',
        'bp',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
