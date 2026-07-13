<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    private function isAdmin()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Customer List
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $this->isAdmin();

        $users = User::whereIn('role', ['customer','astrologer'])
                    ->latest()
                    ->get();
					
        return response()->json([
            'status' => true,
            'message' => 'Customer list fetched successfully',
            'users' => $users,
        ], 200);
    }

	public function store(Request $request)
	{
		$this->isAdmin();

		$validate = Validator::make($request->all(), [
			'name' => 'required',
			'email' => 'required|email|unique:users,email',
			'password' => 'required|min:8',
			'role' => 'required|in:customer,astrologer'
		]);

		if ($validate->fails()) {
			return response()->json([
				'status' => false,
				'message' => $validate->errors()
			], 422);
		}

		$user = User::create([
			'name' => $request->name,
			'email' => $request->email,
			'password' => Hash::make($request->password),
			'role' => $request->role,
			'status' => 1
		]);

		return response()->json([
			'status' => true,
			'message' => 'User created successfully',
			'data' => $user
		], 201);
	}
    /*
    |--------------------------------------------------------------------------
    | Customer Detail
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $this->isAdmin();

        $user = User::whereIn('role', ['customer','astrologer'])
                    ->find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Customer detail fetched successfully',
            'data' => $user
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Customer
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $this->isAdmin();

        $user = User::whereIn('role', ['customer','astrologer'])
                    ->find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $validate = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validate->errors()
            ], 422);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Customer updated successfully',
            'data' => $user
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Customer
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $this->isAdmin();

        $user = User::whereIn('role', ['customer','astrologer'])
                    ->find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'Customer deleted successfully'
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    public function updateStatus(Request $request, $id)
    {
        $this->isAdmin();

        $user = User::whereIn('role', ['customer','astrologer'])
                    ->find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $validate = Validator::make($request->all(), [
            'status' => 'required|in:0,1'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validate->errors()
            ], 422);
        }

        $user->update([
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Customer status updated successfully',
            'data' => $user
        ], 200);
    }
	public function astrologers()
	{
		$astrologers = User::where('role','astrologer')
			->where('status',1)
			->get();

		return response()->json([
			'status'=>true,
			'data'=>$astrologers
		]);
	}
}