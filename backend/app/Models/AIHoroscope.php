<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AIHoroscope extends Model
{
	protected $table = 'ai_horoscopes';
	
    protected $fillable = [
        'user_id',
        'birth_profile_id',
        'model',
        'prompt',
        'response',
        'input_tokens',
        'output_tokens'
    ];

    protected $casts = [
        'response' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function birthProfile()
    {
        return $this->belongsTo(BirthProfile::class);
    }
}