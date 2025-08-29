<?php

namespace App\Services;

use App\Models\Appointment;
use Carbon\Carbon;
use Exception;

class AppointmentSchedulingService
{
    const SLOT_DURATION = 20; // minutes
    const START_TIME = '08:00';
    const END_TIME = '16:20';
    const MAX_SLOTS_PER_DAY = 25;

    /**
     * Generate all possible time slots for a day
     */
    public function generateTimeSlots()
    {
        $slots = [];
        $startTime = Carbon::createFromTimeString(self::START_TIME);

        for ($i = 0; $i < self::MAX_SLOTS_PER_DAY; $i++) {
            $slotStart = $startTime->copy()->addMinutes($i * self::SLOT_DURATION);
            $slotEnd = $slotStart->copy()->addMinutes(self::SLOT_DURATION);

            $slots[] = [
                'start_time' => $slotStart->format('H:i'),
                'end_time' => $slotEnd->format('H:i'),
                'slot_index' => $i
            ];
        }

        return $slots;
    }

    /**
     * Get available slots for a specific date
     */
    public function getAvailableSlots($date)
    {
        $allSlots = $this->generateTimeSlots();
        $bookedSlots = Appointment::forDate($date)
            ->scheduled()
            ->pluck('start_time')
            ->map(function ($time) {
                return Carbon::parse($time)->format('H:i');
            })
            ->toArray();

        return collect($allSlots)->filter(function ($slot) use ($bookedSlots) {
            return !in_array($slot['start_time'], $bookedSlots);
        })->values()->toArray();
    }

    /**
     * Create appointment with priority-based scheduling
     */
    public function createAppointment($data)
    {
        $date = $data['appointment_date'];

        // Check if date is fully booked
        $currentAppointments = Appointment::forDate($date)->scheduled()->count();
        if ($currentAppointments >= self::MAX_SLOTS_PER_DAY) {
            throw new Exception('This date is fully booked. Please select another date.');
        }

        // Create new appointment
        $newAppointment = new Appointment([
            'pregnancy_tracking_id' => $data['pregnancy_tracking_id'],
            'appointment_date' => $date,
            'priority' => $data['priority'],
            'visit_count' => $data['visit_count'],
            'notes' => $data['notes'] ?? null,
            'booking_timestamp' => now(),
            'status' => 'scheduled'
        ]);

        // Calculate priority score
        $newAppointment->save();

        // Reorganize all appointments for this date
        $this->reorganizeAppointments($date);

        return $newAppointment->fresh();
    }

    /**
     * Reorganize appointments based on priority
     */
    public function reorganizeAppointments($date)
    {
        // Get all appointments for the date
        $appointments = Appointment::forDate($date)
            ->scheduled()
            ->get()
            ->sortByDesc(function ($appointment) {
                return $appointment->priority_score;
            });

        // Generate time slots
        $timeSlots = $this->generateTimeSlots();

        // Reassign time slots based on priority
        foreach ($appointments as $index => $appointment) {
            if (isset($timeSlots[$index])) {
                $appointment->update([
                    'start_time' => $timeSlots[$index]['start_time'],
                    'end_time' => $timeSlots[$index]['end_time']
                ]);
            }
        }
    }

    /**
     * Get appointments for a specific date with details
     */
    public function getAppointmentsForDate($date)
    {
        return Appointment::forDate($date)
            ->scheduled()
            ->orderBy('start_time')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'pregnancy_tracking_id' => $appointment->pregnancy_tracking_id,
                    'start_time' => $appointment->start_time,
                    'end_time' => $appointment->end_time,
                    'priority' => $appointment->priority,
                    'visit_count' => $appointment->visit_count,
                    'notes' => $appointment->notes,
                    'priority_score' => $appointment->priority_score
                ];
            });
    }

    /**
     * Check if a date is available for booking
     */
    public function isDateAvailable($date)
    {
        $carbonDate = Carbon::parse($date);

        // Check if it's a weekend
        if ($carbonDate->isWeekend()) {
            return false;
        }

        // Check if it's in the past
        if ($carbonDate->isPast()) {
            return false;
        }

        // Check if fully booked
        $appointmentCount = Appointment::forDate($date)->scheduled()->count();
        return $appointmentCount < self::MAX_SLOTS_PER_DAY;
    }

    /**
     * Get visit count for a patient
     */
    public function getPatientVisitCount($pregnancyTrackingId)
    {
        return Appointment::where('pregnancy_tracking_id', $pregnancyTrackingId)
            ->where('status', '!=', 'cancelled')
            ->count() + 1; // +1 for the current appointment being booked
    }
}
