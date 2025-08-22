<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory;

    protected $fillable = [
        'firstname',
        'lastname',
        'middlename',
        'age',
        'sex',
        'status',
        'birth_date',
        'birth_place',
        'address',
        'riligion',
        'contact',
        'contact_person_name',
        'contact_person_name',
        'contact_person_relationship',
        'region',
        'province',
        'municipality',
        'barangay',
    ];

    public function pregnancy_trackings(): HasMany
    {
        return $this->hasMany(PregnancyTracking::class);
    }

    public function out_patients(): HasMany
    {
        return $this->hasMany(OutPatient::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function prenatal_visits(): HasMany
    {
        return $this->hasMany(PrenatalVisit::class);
    }

    public function immuzition_records(): HasMany
    {
        return $this->hasMany(ImmuzitionRecord::class);
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
