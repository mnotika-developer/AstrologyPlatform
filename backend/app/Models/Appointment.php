<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Service;

class Appointment extends Model
{
    protected $fillable = [
    'user_id',
    'service_id',
    'appointment_date',
    'appointment_time',
    'status',
    'meeting_type',
    'meeting_link',
    'customer_notes',
    'astrologer_notes',
	'astrologer_id'
	];
	
	public function user(){
		return $this->belongsTo(User::class);
	}
	
	public function service(){
		return $this->belongsTo(Service::class);
	}
	public function astrologer()
	{
		return $this->belongsTo(User::class,'astrologer_id');
	}
	public function availability()
	{
		return $this->belongsTo(
			Availability::class,
			'availability_id'
		);
	}
}
