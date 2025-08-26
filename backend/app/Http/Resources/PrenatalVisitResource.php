<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrenatalVisitResource extends JsonResource
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
            'fullname' => $this->patient->fullname,
            'firstname' => $this->patient->firstname,
            'lastname' => $this->patient->lastname,
            'middlename' => $this->patient->middlename,
            'patient_address' => $this->patient->address,
            'age' => $this->patient->age,
            'birth_date' => $this->patient->birth_date,
            'barangay' => $this->patient->barangays->name,
            'municipality' => $this->patient->municipalities->name,
            'province' => $this->patient->provinces->name,
            'contact' => $this->patient->contact,
            'contact_person_name' => $this->patient->contact_person_name,
            'contact_person_number' => $this->patient->contact_person_number,
            'contact_person_relationship' => $this->patient->contact_person_relationship,
            'attending_physician' => $this->attending_physician,
            'date' => $this->date,
            'temp' => $this->temp,
            'weight' => $this->weight,
            'rr' => $this->rr,
            'pr' => $this->pr,
            'two_sat' => $this->two_sat,
            'bp' => $this->bp,
            'fht' => $this->fht,
            'fh' => $this->fh,
            'aog' => $this->aog,
        ];
    }
}
