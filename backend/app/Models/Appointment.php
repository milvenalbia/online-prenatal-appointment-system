<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'pregnancy_tracking_id',
        'appointment_date',
        'start_time',
        'end_time',
        'priority',
        'visit_count',
        'status',
        'notes',
        'booking_timestamp'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'booking_timestamp' => 'datetime'
    ];

    /**
     * Calculate priority score for sorting
     */
    public function getPriorityScoreAttribute()
    {
        // Visit count priority (higher visits = higher priority)
        $visitPriority = $this->visit_count * 1000;

        // Risk priority
        $riskValues = ['high' => 3, 'medium' => 2, 'low' => 1];
        $riskPriority = ($riskValues[$this->priority] ?? 1) * 100;

        // Time priority (earlier bookings get slight priority for ties)
        $timePriority = - ($this->booking_timestamp->timestamp / 1000000);

        return $visitPriority + $riskPriority + $timePriority;
    }

    /**
     * Scope for appointments on a specific date
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('appointment_date', $date);
    }

    /**
     * Scope for scheduled appointments only
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }
}
