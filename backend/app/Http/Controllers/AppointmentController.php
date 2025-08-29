<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Services\AppointmentSchedulingService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    protected $schedulingService;

    public function __construct(AppointmentSchedulingService $schedulingService)
    {
        $this->schedulingService = $schedulingService;
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
            'pregnancy_tracking_id' => 'required|string|max:255',
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
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'priority' => 'sometimes|in:high,medium,low',
            'notes' => 'sometimes|nullable|string|max:1000'
        ]);

        try {
            $appointment = Appointment::findOrFail($id);

            $oldPriority = $appointment->priority;
            $appointment->update($request->only(['priority', 'notes']));

            // If priority changed, reorganize appointments
            if ($request->has('priority') && $oldPriority !== $request->priority) {
                $this->schedulingService->reorganizeAppointments($appointment->appointment_date);
                $appointment = $appointment->fresh();
            }

            return response()->json([
                'message' => 'Appointment updated successfully',
                'appointment' => $appointment
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
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
