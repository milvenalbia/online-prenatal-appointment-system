<?php

namespace App\Http\Controllers;

use App\Http\Resources\OutPatientResource;
use App\Models\OutPatient;
use App\Models\PregnancyTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OutPatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);

        $sortableColumns = [
            'fullname' => 'patients.firstname',
            'date' => 'out_patients.date',
            'time' => 'out_patients.time',
            'age' => 'patients.age',
            'created_at' => 'out_patients.created_at',
        ];

        $sortBy = $sortableColumns[$request->input('sort_by')] ?? 'out_patients.created_at';

        $out_patients = OutPatient::select('out_patients.*')
            ->join('patients', 'patients.id', '=', 'out_patients.patient_id')
            ->with([
                'patient',
                'patient.barangays',
                'patient.municipalities',
                'patient.provinces',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("CONCAT('patients.firstname', ,' ', 'patients.lastname')"), 'LIKE', "%{$search}%");
                    // ->orWhere('pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('out_patients.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('out_patients.created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);


        return [
            'data' => OutPatientResource::collection($out_patients),
            'meta' => [
                'total' => $out_patients->total(),
                'per_page' => $out_patients->perPage(),
                'current_page' => $out_patients->currentPage(),
                'last_page' => $out_patients->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $fields = $request->validate([
            'patient_id'  => 'required|exists:patients,id',
            'date'        => 'required|date',
            'time'        => 'required',
            'weight'      => 'required',
            'height'      => 'required',
            'bp'          => 'required',
            'temp'        => 'required',
            'rr'          => 'required',
            'pr'          => 'required',
            'two_sat'     => 'required',
        ]);


        DB::transaction(function () use ($fields) {

            $pregnancy_tracking = PregnancyTracking::where('patient_id', $fields['patient_id'])
                ->where('isDone', false)
                ->first();

            $outpatient = OutPatient::create($fields);

            $dailyCount = OutPatient::whereDate('created_at', now())->count();

            $fileNumber = now()->format('Y')
                . str_pad($dailyCount, 2, '0', STR_PAD_LEFT)
                . str_pad($outpatient->id, 3, '0', STR_PAD_LEFT);

            $outpatient->update([
                'file_number' => $fileNumber,
                'phic' => $pregnancy_tracking->phic ? 'yes' : 'no',
            ]);
        });



        return [
            'message' => 'Out Patient created successfully!',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(OutPatient $outPatient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OutPatient $outPatient)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OutPatient $outPatient)
    {
        //
    }
}
