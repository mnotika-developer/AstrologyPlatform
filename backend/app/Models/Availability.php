<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Service;

class Availability extends Model
{
    protected $fillable = [
    'astrologer_id',
    'available_date',
    'start_time',
    'end_time',
	'is_booked'
	];
	
	public function astrologer()
	{
		return $this->belongsTo(User::class,'astrologer_id');
	}
}
