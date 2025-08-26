<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImmunizationRequest;
use App\Http\Resources\ImmuzinationRecordResource;
use App\Models\CovidVaccine;
use App\Models\ImmuzitionRecord;
use App\Models\OtherVaccine;
use App\Models\TetanusVaccine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImmuzitionRecordController extends Controller
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
            'age' => 'patients.age',
        ];

        $sortBy = $sortableColumns[$request->input('sort_by')] ?? 'immuzition_records.created_at';

        $immunizations = ImmuzitionRecord::select('immuzition_records.*')
            ->join('patients', 'patients.id', '=', 'immuzition_records.patient_id')
            ->with([
                'patient',
                'tetanus_vaccine',
                'covid_vaccine',
                'other_vaccine',
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
            'data' => ImmuzinationRecordResource::collection($immunizations),
            'meta' => [
                'total' => $immunizations->total(),
                'per_page' => $immunizations->perPage(),
                'current_page' => $immunizations->currentPage(),
                'last_page' => $immunizations->lastPage(),
            ],
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ImmunizationRequest $request)
    {
        try {
            DB::beginTransaction();

            $vaccineData = $request->getVaccineData();
            $vaccineIds = [];

            // Create Tetanus Vaccine if data exists
            if (!empty($vaccineData['tetanus'])) {
                $tetanusVaccine = TetanusVaccine::create($vaccineData['tetanus']);
                $vaccineIds['tetanus_vaccine_id'] = $tetanusVaccine->id;
            }

            // Create COVID Vaccine if data exists
            if (!empty($vaccineData['covid'])) {
                $covidVaccine = CovidVaccine::create($vaccineData['covid']);
                $vaccineIds['covid_vaccine_id'] = $covidVaccine->id;
            }

            // Create Other Vaccine if data exists
            if (!empty($vaccineData['other'])) {
                $otherVaccine = OtherVaccine::create($vaccineData['other']);
                $vaccineIds['other_vaccine_id'] = $otherVaccine->id;
            }

            // Create main Immunization Record
            $immunizationRecord = ImmuzitionRecord::create([
                'patient_id' => $vaccineData['patient_id'],
                'tetanus_vaccine_id' => $vaccineIds['tetanus_vaccine_id'] ?? null,
                'covid_vaccine_id' => $vaccineIds['covid_vaccine_id'] ?? null,
                'other_vaccine_id' => $vaccineIds['other_vaccine_id'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Immunization record created successfully!',
                'data' => $immunizationRecord->load([
                    'patient',
                    'tetanus_vaccine',
                    'covid_vaccine',
                    'other_vaccine'
                ])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error creating immunization record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update existing immunization record
     */
    public function update(ImmunizationRequest $request, $id)
    {
        $immunizationRecord = ImmuzitionRecord::findOrFail($id);

        try {
            DB::beginTransaction();

            $vaccineData = $request->getVaccineData();

            // Update or create Tetanus Vaccine
            $this->updateOrCreateVaccine(
                $immunizationRecord,
                'tetanus_vaccine',
                TetanusVaccine::class,
                $vaccineData['tetanus'],
                'tetanus_vaccine_id'
            );

            // Update or create COVID Vaccine
            $this->updateOrCreateVaccine(
                $immunizationRecord,
                'covid_vaccine',
                CovidVaccine::class,
                $vaccineData['covid'],
                'covid_vaccine_id'
            );

            // Update or create Other Vaccine
            $this->updateOrCreateVaccine(
                $immunizationRecord,
                'other_vaccine',
                OtherVaccine::class,
                $vaccineData['other'],
                'other_vaccine_id'
            );

            // Update patient_id if changed
            $immunizationRecord->update([
                'patient_id' => $vaccineData['patient_id']
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Immunization record updated successfully!',
                'data' => $immunizationRecord->fresh()->load([
                    'patient',
                    'tetanus_vaccine',
                    'covid_vaccine',
                    'other_vaccine'
                ])
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error updating immunization record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to update or create vaccine records
     */
    private function updateOrCreateVaccine($immunizationRecord, $relation, $modelClass, $data, $foreignKey)
    {
        if (!empty($data)) {
            if ($immunizationRecord->$relation) {
                // Update existing vaccine record
                $immunizationRecord->$relation->update($data);
            } else {
                // Create new vaccine record
                $vaccine = $modelClass::create($data);
                $immunizationRecord->$foreignKey = $vaccine->id;
                $immunizationRecord->save();
            }
        } else {
            // Remove vaccine record if no data provided
            if ($immunizationRecord->$relation) {
                $immunizationRecord->$relation->delete();
                $immunizationRecord->$foreignKey = null;
                $immunizationRecord->save();
            }
        }
    }

    /**
     * Display the specified immunization record
     */
    public function show(ImmuzitionRecord $immunizationRecord) {}

    /**
     * Remove the specified immunization record
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $immunizationRecord = ImmuzitionRecord::findOrFail($id);

            // Delete associated vaccine records (cascade delete)
            if ($immunizationRecord->tetanus_vaccine) {
                $immunizationRecord->tetanus_vaccine->delete();
            }
            if ($immunizationRecord->covid_vaccine) {
                $immunizationRecord->covid_vaccine->delete();
            }
            if ($immunizationRecord->other_vaccine) {
                $immunizationRecord->other_vaccine->delete();
            }

            // Delete main record
            $immunizationRecord->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Immunization record deleted successfully!'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error deleting immunization record',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
