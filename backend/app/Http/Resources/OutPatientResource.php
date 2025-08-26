<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutPatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
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
            'status' => $this->patient->status,
            'religion' => $this->patient->religion,
            'birth_date' => $this->patient->birth_date,
            'birth_place' => $this->patient->birth_place,
            'contact' => $this->patient->contact,
            'contact_person_name' => $this->patient->contact_person_name,
            'contact_person_number' => $this->patient->contact_person_number,
            'contact_person_relationship' => $this->patient->contact_person_relationship,
            'attending_physician' => $this->attending_physician,
            'date' => $this->date,
            'time' => $this->time,
            'temp' => $this->temp,
            'weight' => $this->weight,
            'height' => $this->height,
            'rr' => $this->rr,
            'pr' => $this->pr,
            'two_sat' => $this->two_sat,
            'bp' => $this->bp,
        ];
    }
}
