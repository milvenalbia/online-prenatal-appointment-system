<?php

namespace App\Http\Controllers;

use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\PregnancyTracking;
use App\Services\AppointmentSchedulingService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    protected $schedulingService;

    public function __construct(AppointmentSchedulingService $schedulingService)
    {
        $this->schedulingService = $schedulingService;
    }

    public function index(Request $request)
    {
        $search     = $request->input('search');
        $status     = $request->input('status');
        $priority   = $request->input('priority');
        $visit_count   = $request->input('visit_count');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname' => 'pregnancy_trackings.fullname',
            'appointment_date' => 'appointments.appointment_date',
            'created_at' => 'appointments.created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $appointments = Appointment::select('appointments.*')
            ->join('pregnancy_trackings', 'appointments.pregnancy_tracking_id', '=', 'pregnancy_trackings.id')
            ->with([
                'pregnancy_tracking',
                'pregnancy_tracking.patient',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('pregnancy_trackings.fullname', 'LIKE', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('appointments.status', $status);
            })
            ->when($visit_count, function ($query, $visit_count) {
                $query->where('appointments.visit_count', $visit_count);
            })
            ->when($priority, function ($query, $priority) {
                $query->where('appointments.priority', $priority);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('appointments.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('appointments.created_at', '<=', $dateTo);
            })
            ->orderBy($sortableColumns[$sortBy], $sortDir)
            ->paginate($perPage);

        return [
            'data' => AppointmentResource::collection($appointments),
            'meta' => [
                'total' => $appointments->total(),
                'per_page' => $appointments->perPage(),
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
            ],
        ];
    }

    /**
     * Get available slots for a specific date
     */
    public function getAvailableSlots(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date|after:today'
        ]);

        try {
            $availableSlots = $this->schedulingService->getAvailableSlots($request->date);
            $appointments = $this->schedulingService->getAppointmentsForDate($request->date);

            return response()->json([
                'available_slots' => $availableSlots,
                'current_appointments' => $appointments,
                'is_available' => $this->schedulingService->isDateAvailable($request->date)
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Create a new appointment
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'pregnancy_tracking_id' => 'required|exists:pregnancy_trackings,id',
            'appointment_date' => 'required|date|after:today',
            'priority' => 'required|in:high,medium,low',
            'visit_count' => 'integer|min:1',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            // Auto-calculate visit count if not provided
            if (!$request->has('visit_count')) {
                $visitCount = $this->schedulingService->getPatientVisitCount($request->pregnancy_tracking_id);
                $request->merge(['visit_count' => $visitCount]);
            }

            $appointment = $this->schedulingService->createAppointment($request->all());

            return response()->json([
                'message' => 'Appointment created successfully',
                'appointment' => $appointment,
                'assigned_time' => [
                    'start' => $appointment->start_time,
                    'end' => $appointment->end_time
                ]
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get appointments for a date range (for calendar view)
     */
    public function getCalendarData(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        try {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);
            $calendarData = [];

            while ($startDate->lte($endDate)) {
                $dateStr = $startDate->format('Y-m-d');

                if (!$startDate->isWeekend() && !$startDate->isPast()) {
                    $appointments = $this->schedulingService->getAppointmentsForDate($dateStr);

                    $calendarData[$dateStr] = [
                        'appointments' => $appointments->toArray(),
                        'booking_count' => $appointments->count(),
                        'available_slots' => $this->schedulingService->getAvailableSlots($dateStr),
                        'is_available' => $this->schedulingService->isDateAvailable($dateStr)
                    ];
                }

                $startDate->addDay();
            }

            return response()->json($calendarData);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update appointment (limited to notes and priority)
     */
    // public function update(Request $request, $id): JsonResponse
    // {
    //     $request->validate([
    //         'pregnancy_tracking_id' => 'required|exists:pregnancy_trackings,id',
    //         'appointment_date' => 'required|date|after_or_equal:today',
    //         'priority' => 'required|in:high,medium,low',
    //         'visit_count' => 'integer|min:1',
    //         'notes' => 'nullable|string|max:1000'
    //     ]);

    //     try {
    //         $appointment = Appointment::findOrFail($id);

    //         $old_date = $appointment->appointment_date;
    //         $oldPriority = $appointment->priority;
    //         $oldDate = $appointment->appointment_date;
    //         $appointment->update($request->only(['priority', 'notes', 'appointment_date', 'pregnancy_tracking_id', 'visit_count']));

    //         // If priority changed, reorganize appointments
    //         if (($request->has('priority') && $oldPriority !== $request->priority) || ($request->has('appointment_date') && $oldDate !== $request->appointment_date)) {
    //             $updated_priority_score = $this->schedulingService->getPriorityScore($request->visit_count, $request->priority);

    //             $appointment->update(['priority_score' => $updated_priority_score]);
    //             $this->schedulingService->reorganizeAppointments($appointment->appointment_date, $old_date);
    //             $appointment = $appointment->fresh();
    //         }

    //         return response()->json([
    //             'message' => 'Appointment updated successfully',
    //             'appointment' => $appointment
    //         ]);
    //     } catch (Exception $e) {
    //         return response()->json(['error' => $e->getMessage()], 400);
    //     }
    // }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'pregnancy_tracking_id' => 'required|exists:pregnancy_trackings,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'priority' => 'required|in:high,medium,low',
            'visit_count' => 'integer|min:1',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            $appointment = Appointment::findOrFail($id);

            // Store original values for comparison
            $oldDate = $appointment->appointment_date;
            $oldPriority = $appointment->priority;
            $oldVisitCount = $appointment->visit_count;

            $newDate = $request->appointment_date;
            $newPriority = $request->priority;
            $newVisitCount = $request->visit_count;

            // Calculate new priority score
            $newPriorityScore = $this->schedulingService->getPriorityScore($newVisitCount, $newPriority, $appointment->booking_timestamp);

            $hasDateChanged = $oldDate !== $newDate;
            $hasPriorityChanged = $oldPriority !== $newPriority || $oldVisitCount !== $newVisitCount;

            // Handle different update scenarios
            if ($hasDateChanged) {
                // Date is changing - check if target date is full
                $this->handleDateChange($appointment, $request, $oldDate, $newDate, $newPriorityScore);
            } else if ($hasPriorityChanged) {
                // Same date, priority changed - update and reorganize
                $appointment->update([
                    'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
                    'priority' => $newPriority,
                    'visit_count' => $newVisitCount,
                    'notes' => $request->notes,
                    'priority_score' => $newPriorityScore
                ]);

                $this->schedulingService->reorganizeAppointments($oldDate);
            } else {
                // Only notes or pregnancy_tracking_id changed
                $appointment->update($request->only(['pregnancy_tracking_id', 'notes']));
            }

            $appointment = $appointment->fresh();

            return response()->json([
                'message' => 'Appointment updated successfully',
                'appointment' => $appointment,
                'changes' => [
                    'date_changed' => $hasDateChanged,
                    'priority_changed' => $hasPriorityChanged
                ]
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Handle appointment date change with rescheduling logic
     */
    private function handleDateChange($appointment, $request, $oldDate, $newDate, $newPriorityScore)
    {
        // Check if new date is available (excluding current appointment)
        $currentAppointmentsOnNewDate = Appointment::forDate($newDate)
            ->where('id', '!=', $appointment->id)
            ->scheduled()
            ->count();

        // If new date is not full, proceed normally
        if ($currentAppointmentsOnNewDate < $this->schedulingService::MAX_SLOTS_PER_DAY) {
            $appointment->update([
                'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
                'appointment_date' => $newDate,
                'priority' => $request->priority,
                'visit_count' => $request->visit_count,
                'notes' => $request->notes,
                'priority_score' => $newPriorityScore
            ]);

            // Reorganize both old and new dates
            $this->schedulingService->reorganizeAppointments($newDate);
            if ($oldDate !== $newDate) {
                $this->schedulingService->reorganizeAppointments($oldDate);
            }
            return;
        }

        // New date is full - handle rescheduling
        $this->handleFullDateUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore);
    }

    /**
     * Handle updating to a full date with automatic rescheduling
     */
    private function handleFullDateUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore)
    {
        // Get the lowest priority appointment on the target date (excluding current appointment)
        $lowestPriorityAppointment = Appointment::forDate($newDate)
            ->where('id', '!=', $appointment->id)
            ->scheduled()
            ->orderBy('priority_score')
            ->orderByDesc('booking_timestamp') // For same priority, later bookings get moved first
            ->first();

        Log::info("Get Lowest Priority Appointment Id: {$lowestPriorityAppointment->id}");

        Log::info("Priority Score Comparison: {$newPriorityScore} compare to {$lowestPriorityAppointment->priority_score}");
        // Compare priorities
        if ($newPriorityScore > $lowestPriorityAppointment->priority_score) {
            // New appointment has higher priority - reschedule the lowest priority one
            $this->rescheduleLowestPriorityAndUpdate($appointment, $request, $lowestPriorityAppointment, $oldDate, $newDate, $newPriorityScore);
        } else if ($newPriorityScore === $lowestPriorityAppointment->priority_score) {
            // Same priority - check booking_timestamp (who booked first gets preference)
            $updatedBookingTime = $appointment->booking_timestamp;
            $existingBookingTime = $lowestPriorityAppointment->booking_timestamp;

            Log::info("Bookign Timestamp Comparison: {$updatedBookingTime} compare to {$existingBookingTime}");

            if ($updatedBookingTime < $existingBookingTime) {
                // Updated appointment was booked earlier, so it gets the slot
                $this->rescheduleLowestPriorityAndUpdate($appointment, $request, $lowestPriorityAppointment, $oldDate, $newDate, $newPriorityScore);
            } else {
                // Updated appointment was booked later - find alternative for it
                $this->findAlternativeDateForUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore);
            }
        } else {
            // New appointment has lower priority - find alternative for it
            $this->findAlternativeDateForUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore);
        }
    }

    /**
     * Reschedule lowest priority appointment and update current one to target date
     */
    private function rescheduleLowestPriorityAndUpdate($appointment, $request, $lowestPriorityAppointment, $oldDate, $newDate, $newPriorityScore)
    {
        // Find nearest available date for the lowest priority appointment
        $nearestDate = $this->schedulingService->findNearestAvailableDate($newDate);


        if (!$nearestDate) {
            // Try including old date as fallback
            $nearestDate = $this->schedulingService->findNearestAvailableDate($newDate, [$oldDate]);
        }

        if (!$nearestDate) {
            throw new Exception('Cannot update appointment: No available dates found for rescheduling existing appointments.');
        }

        // Move the lowest priority appointment
        $lowestPriorityAppointment->update([
            'appointment_date' => $nearestDate
        ]);

        // Update the current appointment to the target date
        $appointment->update([
            'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
            'appointment_date' => $newDate,
            'priority' => $request->priority,
            'visit_count' => $request->visit_count,
            'notes' => $request->notes,
            'priority_score' => $newPriorityScore
        ]);

        // Reorganize all affected dates
        $this->schedulingService->reorganizeAppointments($newDate);
        $this->schedulingService->reorganizeAppointments($nearestDate);
        if ($oldDate !== $newDate && $oldDate !== $nearestDate) {
            $this->schedulingService->reorganizeAppointments($oldDate);
        }

        // Log the rescheduling
        Log::info("Update: Appointment ID {$lowestPriorityAppointment->id} rescheduled from {$newDate} to {$nearestDate} due to higher priority update");
    }

    /**
     * Find alternative date for the updated appointment
     */
    private function findAlternativeDateForUpdate($appointment, $request, $oldDate, $newDate, $newPriorityScore)
    {
        // Find nearest available date for the updated appointment
        $nearestDate = $this->schedulingService->findNearestAvailableDate($newDate, [$oldDate]);

        if (!$nearestDate) {
            // No alternative found - keep on original date but update other fields
            $appointment->update([
                'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
                'priority' => $request->priority,
                'visit_count' => $request->visit_count,
                'notes' => $request->notes,
                'priority_score' => $newPriorityScore
                // appointment_date remains unchanged
            ]);

            $this->schedulingService->reorganizeAppointments($oldDate);

            throw new Exception("The selected date ({$newDate}) is fully booked with higher priority appointments. Appointment details updated but date remains {$oldDate}.");
        }

        // Update appointment to the nearest available date
        $appointment->update([
            'pregnancy_tracking_id' => $request->pregnancy_tracking_id,
            'appointment_date' => $nearestDate,
            'priority' => $request->priority,
            'visit_count' => $request->visit_count,
            'notes' => $request->notes,
            'priority_score' => $newPriorityScore
        ]);

        // Reorganize both dates
        $this->schedulingService->reorganizeAppointments($nearestDate);
        if ($oldDate !== $nearestDate) {
            $this->schedulingService->reorganizeAppointments($oldDate);
        }

        throw new Exception("The selected date ({$newDate}) was full. Your appointment has been updated and moved to {$nearestDate} instead.");
    }

    /**
     * Cancel appointment
     */
    public function cancel($id): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $date = $appointment->appointment_date;

            $appointment->update(['status' => 'cancelled']);

            // Reorganize remaining appointments
            $this->schedulingService->reorganizeAppointments($date);

            return response()->json(['message' => 'Appointment cancelled successfully']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
