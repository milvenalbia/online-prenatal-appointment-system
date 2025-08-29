<?php

namespace App\Http\Controllers;

use App\Http\Resources\NurseResource;
use App\Http\Resources\SelectNurseResource;
use App\Models\BarangayCenter;
use App\Models\Nurse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NurseController extends Controller
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
            'fullname' => 'firstname',
            'created_at' => 'created_at',
        ];

        if (!array_key_exists($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        $nurses = Nurse::with([
            'barangay_center',
            'barangay_center.barangays',
            'barangay_center.municipalities',
            'barangay_center.provinces'
        ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("CONCAT(firstname, ' ', lastname)"), 'LIKE', "%{$search}%");
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
            'data' => NurseResource::collection($nurses),
            'meta' => [
                'total' => $nurses->total(),
                'per_page' => $nurses->perPage(),
                'current_page' => $nurses->currentPage(),
                'last_page' => $nurses->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'firstname' => 'required|max:255',
            'lastname' => 'required|max:255',
            'barangay_center_id' => 'required|exists:barangay_centers,id',
        ]);

        Nurse::create($fields);

        return [
            'message' => 'Nurse has been created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayCenter $barangay_center)
    {
        $nurses = Nurse::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectNurseResource::collection($nurses);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nurse $nurse)
    {
        $fields = $request->validate([
            'firstname' => 'required|max:255',
            'lastname' => 'required|max:255',
            'barangay_center_id' => 'required|exists:barangay_centers,id',
        ]);

        $nurse->update($fields);

        return [
            'message' => 'Nurse has been updated successfully',
        ];
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nurse $nurse)
    {
        //
    }
}
