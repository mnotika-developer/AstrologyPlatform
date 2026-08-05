<?php

namespace App\Services\BirthProfile;

use App\Models\BirthProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Repositories\Contracts\BirthProfileRepositoryInterface;

class BirthProfileService
{
	
	private BirthProfileRepositoryInterface $birthProfileRepository;

	public function __construct(
		BirthProfileRepositoryInterface $birthProfileRepository
	)
	{
		$this->birthProfileRepository = $birthProfileRepository;
	}
	
	public function getAllByUser(int $userId)
	{
		return $this->birthProfileRepository
			->allByUser($userId);
	}
	
	public function getById(
		int $id,
		int $userId
	): BirthProfile
	{
		$profile = $this->birthProfileRepository
			->findById($id, $userId);

		if (!$profile) {
			abort(404, 'Birth profile not found.');
		}

		return $profile;
	}
    /**
     * Create a new birth profile.
     */
    public function create(array $data): BirthProfile
    {
        $place = $this->buildPlaceOfBirth(
            $data['city'],
            $data['state'] ?? null,
            $data['country']
        );

        return DB::transaction(function () use ($data, $place) {

			return $this->birthProfileRepository->create([

				'user_id' => Auth::id(),

				'full_name' => $data['full_name'],

				'gender' => $data['gender'],

				'relation' => $data['relation'],

				'date_of_birth' => $data['date_of_birth'],

				'birth_time_known' => $data['birth_time_known'],

				'time_of_birth' => $data['birth_time_known']
					? ($data['time_of_birth'] ?? null)
					: null,

				'country' => $data['country'],

				'state' => $data['state'] ?? null,

				'city' => $data['city'],

				'place_of_birth' => $place,

				'latitude' => null,

				'longitude' => null,

				'timezone' => null,

			]);

		});
    }


	public function update(BirthProfile $profile, array $data): BirthProfile
	{
		$place = $this->buildPlaceOfBirth(
			$data['city'],
			$data['state'] ?? null,
			$data['country']
		);

		return DB::transaction(function () use ($profile, $data, $place) {

			return $this->birthProfileRepository->update(
				$profile,
				[

					'full_name' => $data['full_name'],

					'gender' => $data['gender'],

					'relation' => $data['relation'],

					'date_of_birth' => $data['date_of_birth'],

					'birth_time_known' => $data['birth_time_known'],

					'time_of_birth' => $data['birth_time_known']
						? ($data['time_of_birth'] ?? null)
						: null,

					'country' => $data['country'],

					'state' => $data['state'] ?? null,

					'city' => $data['city'],

					'place_of_birth' => $place,

				]
			);

		});

	}
    /**
     * Build the place_of_birth string.
     */
    private function buildPlaceOfBirth(
        string $city,
        ?string $state,
        string $country
    ): string {

        $place = $city;

        if (!empty($state)) {
            $place .= ', '.$state;
        }

        $place .= ', '.$country;

        return $place;
    }
}