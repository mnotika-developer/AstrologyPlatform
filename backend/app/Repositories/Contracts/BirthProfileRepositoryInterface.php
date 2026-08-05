<?php

namespace App\Repositories\Contracts;

use App\Models\BirthProfile;

interface BirthProfileRepositoryInterface
{
    public function allByUser(int $userId);
	
	public function findById(int $id,int $userId): ?BirthProfile;
	
	public function create(array $data): BirthProfile;
	
	public function update(BirthProfile $profile,array $data): BirthProfile;
	
	public function delete(BirthProfile $profile): bool;
}
