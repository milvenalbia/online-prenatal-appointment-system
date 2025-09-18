<?php

namespace App\Http\Controllers;

use App\Http\Resources\OutPatientResource;
use App\Http\Resources\PrenatalOutPatientValueResource;
use App\Models\OutPatient;
use App\Models\PregnancyTracking;
use Carbon\Carbon;
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
        $report     = $request->input('report', false);

        $sortableColumns = [
            'fullname' => 'pregnancy_trackings.fullname',
            'date' => 'out_patients.date',
            'time' => 'out_patients.time',
            'age' => 'patients.age',
            'created_at' => 'out_patients.created_at',
        ];

        $sortBy = $sortableColumns[$request->input('sort_by')] ?? 'out_patients.created_at';

        $out_patients = OutPatient::select('out_patients.*')
            ->join('pregnancy_trackings', 'pregnancy_trackings.id', '=', 'out_patients.pregnancy_tracking_id')
            ->with([
                'pregnancy_tracking',
                'pregnancy_tracking.patient',
                'pregnancy_tracking.patient.barangays',
                'pregnancy_tracking.patient.municipalities',
                'pregnancy_tracking.patient.provinces',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('pregnancy_trackings.fullname', 'LIKE', "%{$search}%")
                        ->orWhere('pregnancy_trackings.pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('out_patients.created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('out_patients.created_at', '<=', $dateTo);
            });

        if ($report) {
            $out_patients = $out_patients->orderBy($sortBy, 'asc');

            $results = $out_patients->get();

            return [
                'data' => OutPatientResource::collection($results),
                'meta' => [
                    'total' => $results->count(),
                    'per_page' => $results->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                ],
            ];
        } else {
            $out_patients = $out_patients->orderBy($sortBy, $sortDir);

            $results = $out_patients->paginate($perPage);

            return [
                'data' => OutPatientResource::collection($results),
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
    public function store(Request $request)
    {

        $fields = $request->validate([
            'pregnancy_tracking_id'  => 'required|exists:pregnancy_trackings,id',
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

            $pregnancy_tracking = PregnancyTracking::where('id', $fields['pregnancy_tracking_id'])
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
    public function show($id)
    {
        $out_patient = OutPatient::with('pregnancy_tracking')
            ->where('pregnancy_tracking_id', $id)
            ->whereDate('created_at', Carbon::now())
            ->first();

        return ['data' => new PrenatalOutPatientValueResource($out_patient)];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OutPatient $outPatient)
    {
        $fields = $request->validate([
            'pregnancy_tracking_id'  => 'required|exists:pregnancy_trackings,id',
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


        DB::transaction(function () use ($fields, $outPatient) {

            $pregnancy_tracking = PregnancyTracking::where('id', $fields['pregnancy_tracking_id'])
                ->where('isDone', false)
                ->first();

            $outPatient->update(array_merge($fields, [
                'phic' => $pregnancy_tracking->phic ? 'yes' : 'no',
            ]));
        });



        return [
            'message' => 'Out Patient updated successfully!',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OutPatient $outPatient)
    {
        //
    }
}
