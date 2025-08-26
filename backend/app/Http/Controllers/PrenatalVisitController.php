<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrenatalVisitResource;
use App\Models\PrenatalVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrenatalVisitController extends Controller
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
            'date' => 'preantal_visits.date',
            'age' => 'patients.age',
            'created_at' => 'prenatal_visits.create_at',
        ];

        $sortBy = $sortableColumns[$request->input('sort_by')] ?? 'prenatal_visits.create_at';

        $prenatal_visits = PrenatalVisit::select('prenatal_visits.*')
            ->join('patients', 'patients.id', '=', 'prenatal_visits.patient_id')
            ->with([
                'patient',
                'patient.barangays',
                'patient.municipalities',
                'patient.provinces',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("CONCAT('firstname', ,' ', 'lastname')"), 'LIKE', "%{$search}%");
                    // ->orWhere('pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);


        return [
            'data' => PrenatalVisitResource::collection($prenatal_visits),
            'meta' => [
                'total' => $prenatal_visits->total(),
                'per_page' => $prenatal_visits->perPage(),
                'current_page' => $prenatal_visits->currentPage(),
                'last_page' => $prenatal_visits->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PrenatalVisit $prenatalVisit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PrenatalVisit $prenatalVisit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PrenatalVisit $prenatalVisit)
    {
        //
    }
}
