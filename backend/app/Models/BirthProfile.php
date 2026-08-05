<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BirthProfile extends Model
{
    protected $fillable=[

		'user_id',

		'full_name',

		'relation',

		'gender',

		'date_of_birth',

		'birth_time_known',

		'time_of_birth',

		'country',

		'state',

		'city',

		'place_of_birth',

		'latitude',

		'longitude',

		'timezone'

		];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
	public function horoscope(){
		return $this->hasMany(AIHoroscope::class,'birth_profile_id');
	}
	public function latesthoroscope(){
		return $this->hasOne(AIHoroscope::class,'birth_profile_id')
			->latestofMany();
	}
}