<?php

namespace App\Http\Controllers;

use App\Http\Resources\BarangayCenterCollection;
use App\Http\Resources\BarangayCenterResource;
use App\Models\BarangayCenter;
use Illuminate\Http\Request;

class BarangayCenterController extends Controller
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
        $sortableColumns = ['id', 'health_station', 'created_at',];
        if (!in_array($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $barangayCenters = BarangayCenter::with(['barangays', 'municipalities', 'provinces'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('health_station', 'LIKE', "%{$search}%");
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
            'data' => BarangayCenterResource::collection($barangayCenters),
            'meta' => [
                'total' => $barangayCenters->total(),
                'per_page' => $barangayCenters->perPage(),
                'current_page' => $barangayCenters->currentPage(),
                'last_page' => $barangayCenters->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'health_station' => 'required|max:255',
            'rural_health_unit' => 'required|max:255',
            'region' => 'required|exists:regions,id',
            'province' => 'required|exists:provinces,id',
            'municipality' => 'required|exists:municipalities,id',
            'barangay' => 'required|exists:barangays,id',
        ]);

        BarangayCenter::create($fields);

        return [
            'message' => 'Barangay Health Station created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayCenter $barangayCenter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BarangayCenter $barangayCenter)
    {
        $fields = $request->validate([
            'health_station' => 'required|max:255',
            'rural_health_unit' => 'required|max:255',
            'region' => 'required|exists:regions,id',
            'province' => 'required|exists:provinces,id',
            'municipality' => 'required|exists:municipalities,id',
            'barangay' => 'required|exists:barangays,id',
        ]);

        $barangayCenter->update($fields);

        return [
            'message' => 'Barangay Health Station updated successfully',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayCenter $barangayCenter)
    {
        //
    }
}
