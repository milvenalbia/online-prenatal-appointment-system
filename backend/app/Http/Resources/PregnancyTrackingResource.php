<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PregnancyTrackingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'barangay_worker_id' => $this->barangay_worker_id,
            'midwife_id' => $this->midwife_id,
            'barangay_center_id' => $this->barangay_center_id,
            'fullname' => $this->fullname,
            'age' => $this->age,
            'year' => $this->created_at->format('Y'),
            'region' => $this->patient->regions->name,
            'province' => $this->patient->provinces->name,
            'municipality' => $this->patient->municipalities->name,
            'barangay' => $this->patient->barangays->name,
            'gravidity' => $this->gravidity,
            'parity' => $this->parity,
            'lmp' => $this->lmp,
            'edc' => $this->edc,
            'birthing_center' => $this->birthing_center,
            'birthing_center_address' => $this->birthing_center_address,
            'referral_center' => $this->referral_center,
            'referral_center_address' => $this->referral_center_address,
            'patient_address' => $this->patient->address,
            'barangay_worker_name' => $this->barangay_worker->fullname,
            'midwife_name' => $this->midwife->fullname,
            'health_station' => $this->barangay_health_station ?? $this->barangay_center->health_station,
            'rural_health_unit' => $this->rural_unit ?? $this->barangay_center->rural_health_unit,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
