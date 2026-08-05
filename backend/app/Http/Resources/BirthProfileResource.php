<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
		        return [

            'id' => $this->id,

            'full_name' => $this->full_name,

            'relation' => $this->relation,

            'gender' => $this->gender,

            'date_of_birth' => $this->date_of_birth,

            'birth_time_known' => (bool) $this->birth_time_known,

            'time_of_birth' => $this->birth_time_known
                ? $this->time_of_birth
                : null,

            'country' => $this->country,

            'state' => $this->state,

            'city' => $this->city,

            'place_of_birth' => $this->place_of_birth,

            'latitude' => $this->latitude,

            'longitude' => $this->longitude,

            'timezone' => $this->timezone,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
			
			'has_horoscope' => $this->latestHoroscope !== null,

			'horoscope_id' => optional($this->latestHoroscope)->id,

        ];
    }
}
