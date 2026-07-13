<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
	private function isAdmin()
    {
        if (Auth::user()->role != 'admin') {
            abort(403, 'Unauthorized');
        }
    }
	
	public function index(){
		
		//$this->isAdmin();
		$services = Service::latest()->get();
		
		return response()->json([
			"status"=>true,
			"message"=>"service fetched successfully",
			"services" =>$services
		],200);
	}
	
	public function show($id){
		$this->isAdmin();
		$services = Service::where('id',$id)->first();
		
		return response()->json([
			"status"=>true,
			"message"=>"service fetched successfully",
			"services" =>$services
		],200);
	}
    public function store(Request $request){
		$this->isAdmin();
		$validate = Validator::make($request->all(),[
			"title" => "required",
			"description" => "required",
			"price" => "required|numeric"
		]);
		
		if($validate->fails()){
			return response()->json([
				"status" => false,
				"message" => $validate->errors()
			],422);
		}
		
		$services = Service::create([
			'title' => $request->title,
			'description' => $request->description,
			'price' => $request->price,
			'duration_minutes' => $request->duration
		]);
		
		return response()->json([
			"status" => true,
			"Message" => "Service added successfully"
		],200);
	}
	
	public function update($id,Request $request){
		$this->isAdmin();
		$validate = Validator::make($request->all(),[
			"title"=>"required",
			"description"=>"required",
			"price"=>"required|numeric"
			
		]);
		
		if($validate->fails()){
			return response()->json([
				"status" => false,
				"message" => $validate->errors()
			],422);
		}
		$service = Service::find($id);

		if(!$service){
			return response()->json([
				"status" => false,
				"message" => 'Service Not found'
			],422);
		}
		$service->update([
			'title' => $request->title,
			'description' => $request->description,
			'price' => $request->price,
			'duration_minutes' => $request->duration
		]);
		return response()->json([
			"status" => true,
			"Message" => "Service updated successfully"
		],200);
	}
	
	public function destroy($id){
		$this->isAdmin();
		$service = Service::find($id);
		if(!$service){
			return response()->json([
				"status" =>false,
				"message" => "Service not found"
			],404);
		}
		
		$service->delete();
		return response()->json([
				"status" =>true,
				"message" => "Service delete successfully"
			],200);
	}
}
