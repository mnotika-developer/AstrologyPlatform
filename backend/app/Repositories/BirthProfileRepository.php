<?php

namespace App\Repositories;

use App\Models\BirthProfile;
use App\Repositories\Contracts\BirthProfileRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BirthProfileRepository  implements BirthProfileRepositoryInterface
{
	
    public function allByUser(int $userId){
		
		return BirthProfile::with('latestHoroscope')
        ->where('user_id', $userId)
        ->get();
	}
	
	public function findById(int $id,int $userId): ?BirthProfile{
		
		return BirthProfile::where('user_id',$userId)
            ->find($id);
	}
	
	public function create(array $data): BirthProfile{
		return BirthProfile::create($data);
	}
	
	public function update(BirthProfile $profile,array $data): BirthProfile{
		$profile->update($data);

		return $profile->fresh();
	}
	
	public function delete(BirthProfile $profile): bool
	{
		return $profile->delete();
	}
}
