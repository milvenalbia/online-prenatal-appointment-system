<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\SelectAddressController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BarangayCenterController;
use App\Http\Controllers\BarangayWorkerController;
use App\Http\Controllers\ImmuzitionRecordController;
use App\Http\Controllers\MidwifeController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\OutPatientController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PregnancyTrackingController;
use App\Http\Controllers\PrenatalVisitController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user()->load('barangay_center');
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
    Route::apiResource('/nurses', NurseController::class);
    Route::apiResource('/pregnancy-trackings', PregnancyTrackingController::class);
    Route::apiResource('/immunization-records', ImmuzitionRecordController::class);
    Route::apiResource('/prenatal-visits', PrenatalVisitController::class);
    Route::apiResource('/out-patients', OutPatientController::class);
    Route::apiResource('/appointments', AppointmentController::class);

    // Route::prefix('appointments')->group(function () {
    //     Route::get('/available-slots', [AppointmentController::class, 'getAvailableSlots']);
    //     Route::get('/calendar', [AppointmentController::class, 'getCalendarData']);
    //     Route::post('/', [AppointmentController::class, 'store']);
    //     Route::put('/{id}', [AppointmentController::class, 'update']);
    //     Route::delete('/{id}', [AppointmentController::class, 'cancel']);
    // });

    Route::get('/select-address/regions', [SelectAddressController::class, 'regions']);
    Route::get('/select-address/provinces/{region}', [SelectAddressController::class, 'provinces']);
    Route::get('/select-address/municipalities/{province}', [SelectAddressController::class, 'municipalities']);
    Route::get('/select-address/barangays/{municipality}', [SelectAddressController::class, 'barangays']);
    Route::get('/midwives/barangay-centers/{barangay_center}', [SelectAddressController::class, 'midwives']);
    Route::get('/barangay-workers/barangay-centers/{barangay_center}', [SelectAddressController::class, 'barangay_workers']);
    Route::get('/nurses/barangay-centers/{barangay_center}', [SelectAddressController::class, 'nurses']);
    Route::get('/address-name', [SelectAddressController::class, 'getAddressName']);
    Route::get('/midwife-and-barangay-worker-name', [SelectAddressController::class, 'getMidwifeAndBarangayWorkerName']);
    Route::get('/midwife-and-nurse-name', [SelectAddressController::class, 'getMidwifeAndNurseName']);
    Route::get('/filter/roles', [SelectAddressController::class, 'roles']);
    Route::get('/filter/pregnancy-trakings', [SelectAddressController::class, 'pregnancy_trackings']);
    Route::get('/filter/pregnancy-trakings/has-appointments', [SelectAddressController::class, 'pregnancy_trackings_has_appointments']);
    Route::get('/available-appointments', [AppointmentController::class, 'getAvailabilityByRange']);
    Route::get('/group-prenatal-visits/{id}', [PrenatalVisitController::class, 'getGroupPrenatalVisit']);
});
