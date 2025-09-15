<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePregnancyTrackingRequest;
use App\Http\Resources\PregnancyTrackingResource;
use App\Models\Appointment;
use App\Models\BarangayCenter;
use App\Models\Patient;
use App\Models\PregnancyTracking;
use App\Models\RiskCode;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PregnancyTrackingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $dateFrom   = $request->input('date_from');
        $category   = $request->input('category');
        $status     = $request->input('status');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);
        $report     = $request->input('report', false);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname' => 'pregnancy_trackings.fullname',
            'age' => 'pregnancy_trackings.age',
            'created_at' => 'pregnancy_trackings.created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $user = Auth::user();

        $pregnancy_trackings = PregnancyTracking::with([
            'patient',
            'patient.barangays',
            'patient.municipalities',
            'patient.provinces',
            'midwife',
            'nurse',
            'risk_codes',
            'barangay_center',
            'doctor',
        ])
            ->when($user->role_id === 2, function ($query) use ($user) {
                $query->where('pregnancy_trackings.barangay_center_id', $user->barangay_center_id);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('pregnancy_trackings.fullname', 'LIKE', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('pregnancy_trackings.barangay_center_id', $category);
            })
            ->when($status, function ($query, $status) {
                $query->where('pregnancy_trackings.pregnancy_status', $status);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('pregnancy_trackings.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('pregnancy_trackings.created_at', '<=', $dateTo);
            });



        if ($report) {
            $pregnancy_trackings = $pregnancy_trackings->orderBy($sortableColumns[$sortBy], 'asc');

            $results = $pregnancy_trackings->get();

            return [
                'data' => PregnancyTrackingResource::collection($results),
                'meta' => [
                    'total' => $results->count(),
                    'per_page' => $results->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                ],
            ];
        } else {
            $pregnancy_trackings = $pregnancy_trackings->orderBy($sortableColumns[$sortBy], $sortDir);

            $results = $pregnancy_trackings->paginate($perPage);

            return [
                'data' => PregnancyTrackingResource::collection($results),
                'meta' => [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                ],
            ];
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePregnancyTrackingRequest $request)
    {
        $fields = $request->validated();
        $patientType = $request->input('patient_type');
        $fields['age'] = Carbon::parse($fields['birth_date'])->age;

        $pregnancy_tracking = DB::transaction(function () use ($fields, $patientType) {
            if ($patientType === 'new') {
                $patient = Patient::create(array_merge($fields, [
                    'address' => 'n/a',
                ]));
                $fields['patient_id'] = $patient->id;

                $address = collect([
                    $patient->zone,
                    optional($patient->barangays)->name,
                    optional($patient->municipalities)->name,
                    optional($patient->provinces)->name,
                ])->filter()->implode(', ');


                $patient->update([
                    'address' => $address,
                ]);

                $health_station = BarangayCenter::find($fields['barangay_center_id']);

                $fields['fullname'] = $patient->fullname;
                $fields['barangay_health_station'] = $health_station?->health_station;
            }

            $pregnancy_tracking = PregnancyTracking::create($fields);

            // Generate unique number after creation
            $dailyCount = PregnancyTracking::whereDate('created_at', now())->count();
            $pregnancy_tracking_number = now()->format('Y')
                . str_pad($dailyCount, 2, '0', STR_PAD_LEFT)
                . str_pad($pregnancy_tracking->id, 3, '0', STR_PAD_LEFT);

            $pregnancy_tracking->update([
                'pregnancy_tracking_number' => $pregnancy_tracking_number,
            ]);

            // Risk codes inside transaction
            foreach ($fields['risk_codes'] ?? [] as $risk) {
                if (!empty($risk['risk_code'])) {
                    RiskCode::create([
                        'pregnancy_tracking_id' => $pregnancy_tracking->id,
                        'risk_code' => $risk['risk_code'] ?? null,
                        'date_detected' => $risk['date_detected'] ?? null,
                    ]);
                }
            }

            return $pregnancy_tracking;
        });

        return [
            'data' => new PregnancyTrackingResource($pregnancy_tracking),
            'message' => 'Pregnancy Tracking created successfully',
        ];
    }



    /**
     * Display the specified resource.
     */
    public function show(PregnancyTracking $pregnancyTracking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePregnancyTrackingRequest $request, PregnancyTracking $pregnancyTracking)
    {
        $fields = $request->validated();
        $patientType = $request->input('patient_type');
        $fields['age'] = Carbon::parse($fields['birth_date'])->age;
        $pregnancy_tracking = DB::transaction(function () use ($fields, $patientType, $pregnancyTracking) {
            if ($patientType === 'edit') {
                $patient = Patient::findOrFail($fields['patient_id']);
                $patient->update($fields);

                $address = "{$patient->zone}, {$patient->barangays->name} {$patient->municipalities->name}, {$patient->provinces->name}";
                $patient->update(['address' => $address]);

                $health_station = BarangayCenter::findOrFail($fields['barangay_center_id']);

                $fields['fullname'] = $patient->fullname;
                $fields['barangay_health_station'] = $health_station->health_station;
            }

            // update the record
            $pregnancyTracking->update($fields);

            $pregnancyTracking->risk_codes()->delete();

            foreach ($fields['risk_codes'] ?? [] as $risk) {
                if (!empty($risk['risk_code'])) {
                    RiskCode::create([
                        'pregnancy_tracking_id' => $pregnancyTracking->id,
                        'risk_code' => $risk['risk_code'] ?? null,
                        'date_detected' => $risk['date_detected'] ?? null,
                    ]);
                }
            }

            // return the model itself
            return $pregnancyTracking;
        });

        return [
            'data' => new PregnancyTrackingResource($pregnancy_tracking),
            'message' => 'Pregnancy Tracking created successfully',
        ];
    }

    public function update_pregnancy(Request $request, PregnancyTracking $pregnancy_tracking)
    {
        $fields = $request->validate([
            'outcome_sex' => 'required',
            'outcome_weight' => 'required',
            'attended_by' => 'required|string|max:255',
            'place_of_delivery' => 'required|string|max:255',
            'date_delivery' => 'required|string|max:255',
            'phic' => 'required',
        ]);

        $pregnancy_tracking->update(array_merge($fields, [
            "isDone" => true,
        ]));

        return [
            'message' => 'Pregnancy Tracking updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PregnancyTracking $pregnancyTracking)
    {
        //
    }
}
