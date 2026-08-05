<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BirthProfile;
use App\Services\AIService;
use App\Models\AIHoroscope;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class AIHoroscopeController extends Controller
{
    protected $ai;
	
	public function __construct(AIService $ai){
		$this->ai=$ai;
	}
	
	public function generate(Request $request){
		$validator = Validator::make($request->all(),[
			'birth_profile_id'=>'required'
		]);
		
		if($validator->fails()){
			return response()->json([
				"status"=>false,
				"message"=>$validator->errors()
			]);
		}
		
		$user = Auth::user();
		$userid = $user->id;
		$birthprofile = BirthProfile::where('user_id',$userid)->where('id',$request->birth_profile_id)->first();
		if(!$birthprofile){
			return response()->json([
				"status"=>false,
				"message"=>"Birth Profile not found"
			],404);
		}
		$prompt = "
			You are an expert Vedic Astrologer.

			Analyze the following birth details carefully.

			Name: {$birthprofile->full_name}
			Gender: {$birthprofile->gender}
			Date of Birth: {$birthprofile->date_of_birth}
			Time of Birth: {$birthprofile->time_of_birth}
			Place of Birth: {$birthprofile->place_of_birth}
			Latitude: {$birthprofile->latitude}
			Longitude: {$birthprofile->longitude}
			Timezone: {$birthprofile->timezone}

			Return ONLY valid JSON.

			Do NOT return markdown.
			Do NOT return explanation.
			Do NOT wrap JSON inside ```.

			Response format:

			{
				\"astrological_foundation\":\"\",
				\"personality\":\"\",
				\"career\":\"\",
				\"love\":\"\",
				\"marriage\":\"\",
				\"health\":\"\",
				\"finance\":\"\",
				\"lucky_number\":[],
				\"lucky_color\":[],
				\"lucky_day\":[],
				\"lucky_gemstone\":\"\",
				\"remedies\":[],
				\"dos\":[],
				\"donts\":[],
				\"summary\":\"\"
			}
			";
		$aidata = $this->ai->generate($prompt);
		if(!$aidata['status']){
			return response()->json($aidata,500);
		}
		$aihoroscope = AIHoroscope::create([

			'user_id'=>$user->id,

			'birth_profile_id'=>$birthprofile->id,

			'model'=>env('GEMINI_MODEL'),

			'prompt'=>$prompt,

			'response'=>$aidata['response'],

			'input_tokens'=>$aidata['usage']['promptTokenCount'] ?? null,

			'output_tokens'=>$aidata['usage']['candidatesTokenCount'] ?? null

		]);

		return response()->json([

			'status'=>true,

			'message'=>'Horoscope Generated Successfully',
			
			'horoscope_id' => $aihoroscope->id,

			'data'=>$aidata['response']

		]);
	}
	
	public function history()
	{
		$horoscopes = AIHoroscope::where('user_id', auth()->id())
			->latest()
			->select(
				'id',
				'model',
				'created_at'
			)
			->paginate(10);

		return response()->json([
			'status' => true,
			'data' => $horoscopes
		]);
	}
	
	public function show($id)
	{
		$horoscope = AIHoroscope::where('user_id', auth()->id())
			->findOrFail($id);

		return response()->json([
			'status' => true,
			'data' => $horoscope
		]);
	}
	public function showbyid($birthid)
	{
		$horoscope = AIHoroscope::where('user_id', auth()->id())
			->where('birth_profile_id',$birthid);

		return response()->json([
			'status' => true,
			'data' => $horoscope
		]);
	}
}
