<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\SelectAddressController;
use App\Http\Controllers\BarangayCenterController;
use App\Http\Controllers\BarangayWorkerController;
use App\Http\Controllers\ImmuzitionRecordController;
use App\Http\Controllers\MidwifeController;
use App\Http\Controllers\OutPatientController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PregnancyTrackingController;
use App\Http\Controllers\PrenatalVisitController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthController::class, 'login'])->middleware(['throttle:login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['throttle:api', 'auth:sanctum'])->group(function () {
    // Api Resource
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/patients', PatientController::class);
    Route::apiResource('/barangay-centers', BarangayCenterController::class);
    Route::apiResource('/midwives', MidwifeController::class);
    Route::apiResource('/barangay-workers', BarangayWorkerController::class);
    Route::apiResource('/pregnancy-trackings', PregnancyTrackingController::class);
    Route::apiResource('/immunization-records', ImmuzitionRecordController::class);
    Route::apiResource('/prenatal-visits', PrenatalVisitController::class);
    Route::apiResource('/out-patients', OutPatientController::class);

    Route::get('/select-address/regions', [SelectAddressController::class, 'regions']);
    Route::get('/select-address/provinces/{region}', [SelectAddressController::class, 'provinces']);
    Route::get('/select-address/municipalities/{province}', [SelectAddressController::class, 'municipalities']);
    Route::get('/select-address/barangays/{municipality}', [SelectAddressController::class, 'barangays']);
    Route::get('/midwives/barangay-centers/{barangay_center}', [SelectAddressController::class, 'midwives']);
    Route::get('/barangay-workers/barangay-centers/{barangay_center}', [SelectAddressController::class, 'barangay_workers']);
    Route::get('/address-name', [SelectAddressController::class, 'getAddressName']);
    Route::get('/midwife-and-barangay-worker-name', [SelectAddressController::class, 'getMidwifeAndBarangayWorkerName']);
    Route::get('/filter/roles', [SelectAddressController::class, 'roles']);
});
