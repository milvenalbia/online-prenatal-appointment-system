<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePregnancyTrackingRequest;
use App\Http\Resources\PregnancyTrackingResource;
use App\Models\Appointment;
use App\Models\BarangayCenter;
use App\Models\Patient;
use App\Models\PregnancyTracking;
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
            'latestAppointment',   // only one appointment
            'patient',
            'patient.barangays',
            'patient.municipalities',
            'patient.provinces',
            'midwife',
            'nurse',
            'risk_codes',
            'barangay_center'
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
                // filter using latest appointment’s visit_count
                $query->whereHas('latestAppointment', function ($q) use ($status) {
                    $q->where('visit_count', $status);
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('pregnancy_trackings.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('pregnancy_trackings.created_at', '<=', $dateTo);
            })
            ->orderBy($sortableColumns[$sortBy], $sortDir)
            ->paginate($perPage);



        return [
            'data' => PregnancyTrackingResource::collection($pregnancy_trackings),
            'meta' => [
                'total' => $pregnancy_trackings->total(),
                'per_page' => $pregnancy_trackings->perPage(),
                'current_page' => $pregnancy_trackings->currentPage(),
                'last_page' => $pregnancy_trackings->lastPage(),
            ],
        ];
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
                    "address" => "n/a",
                ]));
                $fields['patient_id'] = $patient->id;

                $address = "{$patient->zone}, {$patient->barangays->name} {$patient->municipalities->name}, {$patient->provinces->name}";
                $patient->update([
                    'address' => $address,
                ]);

                $health_station = BarangayCenter::where('id', $fields['barangay_center_id'])->first();

                $fields['fullname'] = $patient->fullname;
                $fields['barangay_health_station'] = $health_station->health_station;
            }

            return PregnancyTracking::create($fields);
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
    public function update(Request $request, PregnancyTracking $pregnancyTracking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PregnancyTracking $pregnancyTracking)
    {
        //
    }
}
