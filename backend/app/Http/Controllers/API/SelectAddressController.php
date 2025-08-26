<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GetAddressesNameResource;
use App\Http\Resources\GetMidwivesAndBarangayWorkersResource;
use App\Http\Resources\SelectBarangayWorkerResource;
use App\Http\Resources\SelectMidWifeResource;
use App\Models\Barangay;
use App\Models\BarangayCenter;
use App\Models\BarangayWorker;
use App\Models\Midwife;
use App\Models\Municipality;
use App\Models\Province;
use App\Models\Region;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SelectAddressController extends Controller
{
    public function regions()
    {
        return Cache::remember('regions_select', 3600, function () {
            return Region::select('id', 'name')
                ->orderBy('name')
                ->get();
        });
    }

    public function provinces(Region $region)
    {
        return Cache::remember("provinces_region_{$region->id}", 3600, function () use ($region) {
            return Province::select('id', 'name')
                ->where('region_id', $region->id)
                ->orderBy('name')
                ->get();
        });
    }

    public function municipalities(Province $province)
    {
        return Cache::remember("municipalities_province_{$province->id}", 3600, function () use ($province) {
            return Municipality::select('id', 'name')
                ->where('province_id', $province->id)
                ->orderBy('name')
                ->get();
        });
    }

    public function barangays(Municipality $municipality)
    {
        return Cache::remember("barangays_municipality_{$municipality->id}", 3600, function () use ($municipality) {
            return Barangay::select('id', 'name')
                ->where('municipality_id', $municipality->id)
                ->orderBy('name')
                ->get();
        });
    }

    public function roles()
    {
        return Cache::remember("roles", 3600, function () {
            return Role::select('id', 'role')
                ->orderBy('role')
                ->get();
        });
    }

    public function getAddressName(Request $request)
    {
        $barangay = Barangay::find($request->input('barangay_id'));
        $municipality = Municipality::find($request->input('municipality_id'));
        $province = Province::find($request->input('province_id'));
        $region = Region::find($request->input('region_id'));

        // Bundle the names into a simple object or array
        $address = (object) [
            'barangay_name' => $barangay?->name,
            'municipality_name' => $municipality?->name,
            'province_name' => $province?->name,
            'region_name' => $region?->name,
        ];

        return new GetAddressesNameResource($address);
    }

    public function getMidwifeAndBarangayWorkerName(Request $request)
    {
        $midwife = Midwife::find($request->input('midwife_id'));
        $barangay_worker = BarangayWorker::find($request->input('barangay_worker_id'));

        $data = (object) [
            'midwife_name' => $midwife?->fullname,
            'barangay_worker_name' => $barangay_worker?->fullname,
        ];

        return new GetMidwivesAndBarangayWorkersResource($data);
    }

    public function midwives(BarangayCenter $barangay_center)
    {
        $midwives = Midwife::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectMidWifeResource::collection($midwives);
    }

    public function barangay_workers(BarangayCenter $barangay_center)
    {
        $barangay_workers = BarangayWorker::where('barangay_center_id', $barangay_center->id)
            ->get();

        return SelectBarangayWorkerResource::collection($barangay_workers);
    }



    // Optional: Method to preload all address data for edit forms
    public function preloadAddressData(Request $request)
    {
        $regionId = $request->get('region_id');
        $provinceId = $request->get('province_id');
        $municipalityId = $request->get('municipality_id');

        $data = [];

        if ($regionId) {
            $data['provinces'] = Cache::remember("provinces_region_{$regionId}", 3600, function () use ($regionId) {
                return Province::select('id', 'name')
                    ->where('region_id', $regionId)
                    ->orderBy('name')
                    ->get();
            });

            if ($provinceId) {
                $data['municipalities'] = Cache::remember("municipalities_province_{$provinceId}", 3600, function () use ($provinceId) {
                    return Municipality::select('id', 'name')
                        ->where('province_id', $provinceId)
                        ->orderBy('name')
                        ->get();
                });

                if ($municipalityId) {
                    $data['barangays'] = Cache::remember("barangays_municipality_{$municipalityId}", 3600, function () use ($municipalityId) {
                        return Barangay::select('id', 'name')
                            ->where('municipality_id', $municipalityId)
                            ->orderBy('name')
                            ->get();
                    });
                }
            }
        }

        return response()->json($data);
    }
}
