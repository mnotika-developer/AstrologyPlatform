<?php

namespace App\Traits;

trait ApiResponse
{
    public function successResponse(
		$data=null,
		string $message = 'Success',
		int $status = 200
	){
		return response()->json([
			'status' => true,
			'message' => $message,
			'data' => $data
		]);
	}
	
	public function errorResponse(
		string $message = 'Something went wrong',
		int $status = 500,
		$errors = null
	){
		return response()->json([
			'status' => false,
			'message' => $message,
			'errors' => $errors
		]);
	}
}
