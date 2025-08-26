<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetMidwivesAndBarangayWorkersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'midwife_name' => $this->midwife_name,
            'barangay_worker_name' => $this->barangay_worker_name,
        ];
    }
}
