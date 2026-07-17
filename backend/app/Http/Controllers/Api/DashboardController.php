<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Service;
use App\Models\Appointment;

class DashboardController extends Controller
{
    public function index(){
		if(Auth::user()->role=='admin'){
			$totalCustomer = User::where('role','customer')->count();
			$totalAstrolger = User::where('role','astrologer')->count();
			$totalService = Service::where('status',1)->count();
			$totalAppointment = Appointment::count();
			$totalpendingappointment = Appointment::where('status','pending')->count();
			$totalcompletedppointment = Appointment::where('status','completed')->count();
			$totalconfirmedappointment = Appointment::where('status','confirmed')->count();
			$totalcancelledappointment = Appointment::where('status','cancelled')->count();
			$result = array(
			   'totalCustomer'=>$totalCustomer,
			   'totalAstrologer'=>$totalAstrolger,
			   'totalService'=>$totalService,
			   'totalAppointment'=>$totalAppointment,
			   'totalpendingappointment'=>$totalpendingappointment,
			   'totalcompletedppointment'=>$totalcompletedppointment,
			   'totalconfirmedappointment'=>$totalconfirmedappointment,
			   'totalcancelledappointment'=>$totalcancelledappointment,
			);
		}
		elseif(Auth::user()->role=='customer'){
			$totalAppointment = Appointment::where('user_id',Auth::id())->count();
			$totalpendingappointment = Appointment::where('status','pending')->where('user_id',Auth::id())->count();
			$totalcompletedppointment = Appointment::where('status','completed')->where('user_id',Auth::id())->count();
			$totalconfirmedappointment = Appointment::where('status','confirmed')->where('user_id',Auth::id())->count();
			$totalcancelledappointment = Appointment::where('status','cancelled')->where('user_id',Auth::id())->count();
			$result = array(
			   'totalAppointment'=>$totalAppointment,
			   'totalpendingappointment'=>$totalpendingappointment,
			   'totalcompletedppointment'=>$totalcompletedppointment,
			   'totalconfirmedappointment'=>$totalconfirmedappointment,
			   'totalcancelledappointment'=>$totalcancelledappointment,
			);
		}
		elseif(Auth::user()->role=='astrologer'){
			$totelAppointment = Appointment::where('astrologer_id',Auth::id())->count();
			$totalpendingappointment = Appointment::where('status','pending')->where('astrologer_id',Auth::id())->count();
			$totalcompletedppointment = Appointment::where('status','completed')->where('astrologer_id',Auth::id())->count();
			$totalconfirmedappointment = Appointment::where('status','confirmed')->where('astrologer_id',Auth::id())->count();
			$totalcancelledappointment = Appointment::where('status','cancelled')->where('astrologer_id',Auth::id())->count();
			$result = array(
			   'totalAppointment'=>$totelAppointment,
			   'totalpendingappointment'=>$totalpendingappointment,
			   'totalcompletedppointment'=>$totalcompletedppointment,
			   'totalconfirmedappointment'=>$totalconfirmedappointment,
			   'totalcancelledappointment'=>$totalcancelledappointment,
			);
		}
		else{
			return response()->json([
				"status"=>false,
				"message"=>"Invalid role"
			],403);
		}
		return response()->json([
			"status"=>true,
			"message"=>"Dashboard Stat found",
			"data"=>$result
		]);
	}
	
	public function profile(){
		if(Auth::user()->role=='admin'){
			$userdetail = User::select('name','email','created_at','role')->where('id',Auth::id())->first();
		}
		elseif(Auth::user()->role=='customer'){
			$userdetail = User::select('name','email','created_at','role')->where('id',Auth::id())->where('role','customer')->first();
		}
		elseif(Auth::user()->role=='astrologer'){
			$userdetail = User::select('name','email','created_at','role')->where('id',Auth::id())->where('role','astrologer')->first();
		}
		if(empty($userdetail)){
			return response()->json([
				"status"=>false,
				"message"=>"User not found",
			],403);
		}
		return response()->json([
				"status"=>true,
				"message"=>"User Found",
				"data"=>$userdetail
		],200);
	}
	
	public function updateprofile(Request $request){
		try{
			$validate = Validator::make($request->all(),[
				"name"=>'required',
				"email"=>'required|email|unique:users,email,'. Auth::id()
			]);
			if($validate->fails()){
				return response()->json([
					"status"=>false,
					"message"=>$validate->errors(),
				],422);
			}
			$userexist = Auth::user();
			if(!$userexist){
				return response()->json([
					"status"=>false,
					"message"=>"User not found",
				],404);
			}
			
			$userexist->update([
				"name"=>$request->name,
				"email"=>$request->email,
			]);
			return response()->json([
					"status"=>true,
					"message"=>"User Profile Updated",
			],200);
		}catch (\Exception $e) {

			return response()->json([
				"status" => false,
				"message" => $e->getMessage(),
				"line" => $e->getLine(),
				"file" => $e->getFile()
			], 500);

		}
	}
	
	public function updatePassword(Request $request){
		$validate = Validator::make($request->all(),[
				"oldpassword"=>'required',
				"newpassword"=>'required|min:8',
				"confirmpassword"=>'required|same:newpassword',
		]);
		if($validate->fails()){
			return response()->json([
				"status"=>false,
				"message"=>$validate->errors()
			],422);
		}
		$user = Auth::user();
		$userpassword = $user->password;
		$passcheck = Hash::check($request->oldpassword,$userpassword);
		if(!$passcheck){
			return response()->json([
				"status"=>false,
				"message"=>"Old Password Incorrect",
			],401);
		}
		$user->update([
			"password"=>Hash::make($request->newpassword)
		]);
		return response()->json([
			"status"=>true,
			"message"=>"Password updated successfully"
		]);
	}
}
