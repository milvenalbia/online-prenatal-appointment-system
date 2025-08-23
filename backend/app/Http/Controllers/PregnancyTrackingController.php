<?php

namespace App\Http\Controllers;

use App\Http\Resources\PregnancyTrackingResource;
use App\Models\PregnancyTracking;
use Illuminate\Http\Request;
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
        $dateTo     = $request->input('date_to');
        $sortBy     = $request->input('sort_by', 'created_at');
        $sortDir    = $request->input('sort_dir', 'desc');
        $perPage    = $request->input('per_page', 10);

        // Optional: whitelist sortable columns to prevent SQL injection
        $sortableColumns = [
            'fullname',
            'age',
            'created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $pregnancy_trackings = PregnancyTracking::with([
            'patient',
            'patient.barangays',
            'patient.municipalities',
            'patient.provinces',
            'midwife',
            'barangay_worker',
            'branagay_center'
        ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('fullname', 'LIKE', "%{$search}%");
                    // ->orWhere('pregnancy_tracking_number', 'LIKE', "%{$search}%");
                });
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
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
    public function store(Request $request)
    {
        //
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
