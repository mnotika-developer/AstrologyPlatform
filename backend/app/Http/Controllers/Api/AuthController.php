<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{	
	public function register(Request $request){
		        
		try{
		// Validate request data
		$validate= Validator::make($request->all(),[
				'name' => 'required|string|max:255',
				'email' => 'required|email|unique:users,email',
				'password' => 'required|min:6|confirmed'
		]);
		
		// Return validation errors
	if($validate->fails()){
		return response()->json([
			'status'=> false,
			'message'=>$validate->errors()
		],422);
	}
	
	// Create user
	$user = User::create([
		'name' => $request->name,
		'email' => $request->email,
		'password' => Hash::make($request->password),
		'role' => 'customer',
	]);
	
	 // Create Sanctum token
	 $token = $user->createToken('auth_token')->plainTextToken;
	 
	 return response()->json([
		'status' =>true,
		'message' => 'User has been registed',
		'token' => $token,
		'user' => $user
	 ],200);
	 } catch (\Exception $e) {

        return response()->json([
            'error' => $e->getMessage()
        ], 500);

    }
	}
	public function login(Request $request){
		
		// validate request
		$validate = Validator::make($request->all(),[
			'email' => 'required|email',
			'password' => 'required'
		]);
		
		if($validate->fails()){
			return response()->json([
				'status'=>false,
				'message'=>$validate->errors()
			],422);
		}
		
		$user = User::where('email',$request->email)->first();
		if(!$user){
			return response()->json([
				'status'=>false,
				'message'=> 'User not found'
			],404);
		}
		
		if(!Hash::check($request->password, $user->password)){
			return response()->json([
				'status'=>false,
				'message'=>'Password did not match'
			],401);
		}
		
		$token = $user->createToken('auth_token')->plainTextToken;
		
		return response()->json([
			'status' =>true,
			'message' => 'Login Successful',
			'token' => $token,
			'user' => $user,
		],200);
	}
	
	public function user(Request $request){
		
		return response()->json([
			'status' => true,
			'user' => $request->user()
		],200);
		
	}
	
	public function logout(Request $request){
		
		$request->user()->currentAccessToken()->delete();
		return response()->json([
			'status' => true,
			'user' => 'Logged Out Successful'
		],200);
	}
	
	public function userlist(){
		$userdt = User::where('role','customer')->get();
		return response()->json([
			"status" => true,
			"users" => $userdt
		],200);
	}
}
