<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Availability;

class AppointmentController extends Controller
{
    public function index(){
		if (Auth::user()->role === 'admin') {
			$appointlist = Appointment::with('user','service','astrologer')->get();
		}
		elseif (Auth::user()->role === 'astrologer') {
			$appointlist = Appointment::with('user','service','astrologer')->where('astrologer_id',Auth::id())->get();
		}
		else{
			$appointlist = Appointment::with('user','service','astrologer')->where('user_id',Auth::id())->get();
		}

		if($appointlist->isEmpty()){
			return response()->json([
				"status"=>false,
				"message"=>"No Appointment list found"
			],404);
		}
		return response()->json([
			"status"=>true,
			"message"=>"Appointment list found",
			"data"=>$appointlist
		],200);
	}
	
	public function store(Request $request){
		$validator = Validator::make($request->all(),[
			"service_id"=>"required|exists:services,id",
			"astrologer_id"=>"required|exists:users,id",
			"slot_id"=>"required|exists:availabilities,id",
			'meeting_type' => 'required|in:online,offline',
			"customer_notes" => "nullable|string"
		]);
		if($validator->fails()){
			return response()->json([
				"status"=>false,
				"message"=>$validator->errors()
			],422);
		}
		$slotinfo = Availability::where('id',$request->slot_id)->first();
		if(empty($slotinfo)){
			return response()->json([
				"status"=>false,
				"message"=>'No Slot found'
			],403);
		}
		$appnt = Appointment::create([
			'user_id' => Auth::id(),
			'service_id' => $request->service_id,
			'astrologer_id' => $request->astrologer_id,
			'availability_id' => $request->slot_id,
			'appointment_date' => $slotinfo->available_date,
			'appointment_time' => $slotinfo->start_time,
			'meeting_type' => $request->meeting_type,
			'customer_notes' => $request->customer_notes,
		]);
		$slotinfo->update([
			"is_booked"=>1,
		]);
		return response()->json([
			"status"=>true,
			"message"=>"Appointment added successfully"
		],200);
		
	}
	
	public function show($id){
		if (Auth::user()->role === 'admin') {
			$appoint = Appointment::with('user','service')->find($id);
		}
		else{
			$appoint = Appointment::with('user','service')->where('user_id',Auth::id())->find($id);
		}
		if(!$appoint){
			return response()->json([
				"status"=>false,
				"message"=>"No Appointment found"
			],404);
		}
		return response()->json([
			"status"=>true,
			"message"=>"Appointment found",
			"data"=>$appoint
		],200);
	}
	
	public function update($id, Request $request){
		try{
		$validate = Validator::make($request->all(),[
			"service_id"=>"required|exists:services,id",
			"astrologer_id"=>"required",
			"slot_id"=>"required",
			"customer_notes" => "nullable|string",
			'meeting_type' => 'required|in:online,offline',
		]);
		if($validate->fails()){
			return response()->json([
				"status"=>false,
				"message"=>$validate->errors()
			],422);
		}
		if (Auth::user()->role === 'admin') {
			$appoint = Appointment::with('user','service')->where('id',$id)->first();
		}
		else{
			$appoint = Appointment::with('user','service')->where('id',$id)->where('user_id',Auth::id())->first();
		}
		if(!$appoint){
			return response()->json([
				"status"=>false,
				"message"=>"No Appointment found"
			],404);
		}
		$appoint->update([
			'service_id' => $request->service_id,
			'astrologer_id' => $request->astrologer_id,
			'availability_id' => $request->slot_id,
			'meeting_type' => $request->meeting_type,
			'customer_notes' => $request->customer_notes,
		]);
		return response()->json([
			"status"=>true,
			"message"=>"Appointment updated successfully",
			"data"=>$appoint
		],200);
		}catch(\Exception $e){
				return response()->json([
				"status"=>false,
				"data"=>$e->getMessage(),
				"line"=>$e->getLine()
			],200);
		}
		
	}
	
	public function updateStatus($id,Request $request){
		if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'astrologer') {
			return response()->json([
				"status" => false,
				"message" => "Unauthorized"
			], 403);
		}

		$appoint = Appointment::find($id);

		if (!$appoint) {
			return response()->json([
				"status" => false,
				"message" => "Appointment not found"
			], 404);
		}
		
		$validate = Validator::make($request->all(),[
			"status"=>"required|in:pending,confirmed,cancelled,completed"
		]);
		if($validate->fails()){
			return response()->json([
				"status"=>false,
				"message"=>$validate->errors()
			],422);
		}
		$appoint->update([
			'status' => $request->status,
		]);
		return response()->json([
			"status"=>true,
			"message"=>"Appointment status updated successfully",
			"data"=>$appoint
		],200);
	}
	public function destroy($id){
		if (Auth::user()->role === 'admin') {
			$appoint = Appointment::where('id',$id)->first();
		}
		else{
		$appoint = Appointment::where('id',$id)->where('user_id',Auth::id())->first();
		}
		if(!$appoint){
			return response()->json([
				"status"=>false,
				"message"=>"No Appointment found"
			],404);
		}
		$appoint->delete();
		return response()->json([
			"status"=>true,
			"message"=>"Appointment deleted"
		],200);
	}
	
	
	public function assignAstrologers(Request $request,$id){
		if (Auth::user()->role === 'admin') {
			$appoint = Appointment::where('id',$id)->first();
		}
		else{
			$appoint = Appointment::where('id',$id)->where('user_id',Auth::id())->first();
		}
		if(!$appoint){
			return response()->json([
				"status"=>false,
				"message"=>"No Appointment found"
			],404);
		}
		$appoint->update([
			'astrologer_id' => $request->astro_id
		]);
		return response()->json([
			"status"=>true,
			"message"=>"Astrologer assigned successfully",
			"data"=>$appoint
		],200);
	}
	
	public function updateNotes($id,Request $request){
		if (Auth::user()->role !== 'astrologer') {
			return response()->json([
				"status" => false,
				"message" => "Unauthorized"
			], 403);
		}

		$appoint = Appointment::find($id);

		if (!$appoint) {
			return response()->json([
				"status" => false,
				"message" => "Appointment not found"
			], 404);
		}
		
		$validate = Validator::make($request->all(),[
			"notes"=>"required|string"
		]);
		if($validate->fails()){
			return response()->json([
				"status"=>false,
				"message"=>$validate->errors()
			],422);
		}
		$appoint->update([
			'astrologer_notes' => $request->notes,
		]);
		return response()->json([
			"status"=>true,
			"message"=>"Appointment notes updated successfully",
			"data"=>$appoint
		],200);
	}
}
