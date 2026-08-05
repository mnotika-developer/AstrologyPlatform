<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BirthProfile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\BirthProfileResource;
use App\Http\Requests\BirthProfileRequest;
use App\Services\BirthProfile\BirthProfileService;

class BirthProfileController extends Controller
{
	use ApiResponse;
	private BirthProfileService $birthProfileService;
	
	public function __construct(BirthProfileService $birthProfileService)
	{
		$this->birthProfileService = $birthProfileService;
	}
    /**
     * Display logged in user's birth profile.
     */
    public function plist()
    {
         $profiles = $this->birthProfileService
        ->getAllByUser(Auth::id());
		
		return $this->successResponse(
			BirthProfileResource::collection($profiles)
		);
    }
	
	public function show($id)
    {
        $profile = $this->birthProfileService
        ->getById($id, Auth::id());

        /*return response()->json([
            'status' => true,
            'data' => new BirthProfileResource($profile)
        ]);*/
		
		return $this->successResponse(
			new BirthProfileResource($profile)
		);
    }

    /**
     * Store Birth Profile.
     */
    public function store(BirthProfileRequest $request)
    {
        
		$profile = $this->birthProfileService->create(
				$request->validated()
		);

        /*return response()->json([
            'status' => true,
            'message' => 'Birth profile created successfully.',
            'data' => new BirthProfileResource($profile)
        ], 201);*/
		
		return $this->successResponse(
			new BirthProfileResource($profile),
			'Birth profile created successfully.',
			201
		);
    }

    /**
     * Update Birth Profile.
     */
    public function update(BirthProfileRequest $request,$id)
    {
        $profile = BirthProfile::where('user_id', Auth::id())->findOrFail($id);
		
        $profile = $this->birthProfileService->update(
			$profile,
			$request->validated()
		);

		return $this->successResponse(
			new BirthProfileResource($profile),
			'Birth profile created successfully.',
			201
		);
    }
}