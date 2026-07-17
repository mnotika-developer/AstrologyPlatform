<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Availability;
use App\Models\User;


class AvailabilityController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Availability List
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        if(Auth::user()->role == 'admin'){
            $availability = Availability::with('astrologer')
                            ->latest()
                            ->get();
        }
        else{
            $availability = Availability::with('astrologer')
                            ->where(
                                'astrologer_id',
                                Auth::id()
                            )
                            ->latest()
                            ->get();
        }

        return response()->json([
            'status' => true,
            'message' => 'Availability list fetched successfully',
            'data' => $availability
        ],200);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Availability Slot
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        if(Auth::user()->role != 'astrologer'){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ],403);
        }

        $validate = Validator::make($request->all(),[
            'slot_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time'
        ]);

        if($validate->fails()){
            return response()->json([
                'status' => false,
                'message' => $validate->errors()
            ],422);
        }

        /*
        |--------------------------------------------------------------------------
        | Overlapping Slot Check
        |--------------------------------------------------------------------------
        */

        $exists = Availability::where(
                        'astrologer_id',
                        Auth::id()
                    )
                    ->where(
                        'available_date',
                        $request->slot_date
                    )
                    ->where(function($query) use ($request){

                        $query->whereBetween(
                            'start_time',
                            [
                                $request->start_time,
                                $request->end_time
                            ]
                        )
                        ->orWhereBetween(
                            'end_time',
                            [
                                $request->start_time,
                                $request->end_time
                            ]
                        );

                    })->exists();

        if($exists){
            return response()->json([
                'status' => false,
                'message' => 'Slot overlaps with existing slot'
            ],422);
        }

        $availability = Availability::create([
            'astrologer_id' => Auth::id(),
            'available_date' => $request->slot_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => 0
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Slot created successfully',
            'data' => $availability
        ],201);
    }

    /*
    |--------------------------------------------------------------------------
    | Single Slot
    |--------------------------------------------------------------------------
    */

    public function show(string $id)
    {
        $availability = Availability::with(
                            'astrologer'
                        )->find($id);

        if(!$availability){
            return response()->json([
                'status' => false,
                'message' => 'Slot not found'
            ],404);
        }

        return response()->json([
            'status' => true,
            'data' => $availability
        ],200);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Slot
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, string $id)
    {
        $availability = Availability::find($id);

        if(!$availability){
            return response()->json([
                'status' => false,
                'message' => 'Slot not found'
            ],404);
        }

        if(
            Auth::user()->role != 'admin' &&
            $availability->astrologer_id != Auth::id()
        ){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ],403);
        }

        $validate = Validator::make($request->all(),[
            'slot_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time'
        ]);

        if($validate->fails()){
            return response()->json([
                'status' => false,
                'message' => $validate->errors()
            ],422);
        }

        $availability->update([
            'available_date' => $request->slot_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Slot updated successfully',
            'data' => $availability
        ],200);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Slot
    |--------------------------------------------------------------------------
    */

    public function destroy(string $id)
    {
        $availability = Availability::find($id);

        if(!$availability){
            return response()->json([
                'status' => false,
                'message' => 'Slot not found'
            ],404);
        }

        if(
            Auth::user()->role != 'admin' &&
            $availability->astrologer_id != Auth::id()
        ){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ],403);
        }

        if($availability->is_booked){
            return response()->json([
                'status' => false,
                'message' => 'Booked slots cannot be deleted'
            ],422);
        }

        $availability->delete();

        return response()->json([
            'status' => true,
            'message' => 'Slot deleted successfully'
        ],200);
    }
	
	public function slotList($id)
    {
		$astrocheck = User::where('id',$id)->where('role','astrologer')->first();
		if(!$astrocheck){
			return response()->json([
                'status' => false,
                'message' => 'Astrologer not found'
            ],403);
		}
        $availability = Availability::with(
                            'astrologer'
                        )                
				->where('astrologer_id',$id)
                ->where('is_booked',0)
                ->get();

        if($availability->isEmpty()){
            return response()->json([
                'status' => false,
                'message' => 'Slots not found'
            ],404);
        }

        return response()->json([
            'status' => true,
            'data' => $availability
        ],200);
    }
}