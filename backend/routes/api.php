<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController as UserAuthController;
use App\Http\Controllers\Api\ServiceController as ServiceController;
use App\Http\Controllers\Api\AppointmentController as AppointmentController;
use App\Http\Controllers\Api\DashboardController as DashboardController;
use App\Http\Controllers\Api\UserController as UserController;
use App\Http\Controllers\Api\AvailabilityController as AvailabilityController;

Route::post('/register',[UserAuthController::class,'register']);
Route::post('/login',[UserAuthController::class,'login']);

//User Routes

Route::middleware('auth:sanctum')->get('/user',[UserAuthController::class,'user']);
Route::middleware('auth:sanctum')->get('/user',[UserAuthController::class,'user']);
Route::middleware('auth:sanctum')->get('/userlist',[UserAuthController::class,'userlist']);

Route::middleware('auth:sanctum')->get('/services', [ServiceController::class,'index']);

Route::middleware('auth:sanctum')->post('/services', [ServiceController::class,'store']);

Route::middleware('auth:sanctum')->get('/services/{id}', [ServiceController::class,'show']);

Route::middleware('auth:sanctum')->put('/services/{id}', [ServiceController::class,'update']);

Route::middleware('auth:sanctum')->delete('/services/{id}', [ServiceController::class,'destroy']);

Route::middleware('auth:sanctum')->get('/appointments', [AppointmentController::class,'index']);

Route::middleware('auth:sanctum')->post('/appointments', [AppointmentController::class,'store']);

Route::middleware('auth:sanctum')->put('/appointments/{id}/status', [AppointmentController::class,'updateStatus']);

Route::middleware('auth:sanctum')->get('/appointments/{id}', [AppointmentController::class,'show']);

Route::middleware('auth:sanctum')->put('/appointments/{id}', [AppointmentController::class,'update']);

Route::middleware('auth:sanctum')->put('/appointments/{id}/astrologer', [AppointmentController::class,'assignAstrologers']);

Route::middleware('auth:sanctum')->delete('/appointments/{id}', [AppointmentController::class,'destroy']);

Route::middleware('auth:sanctum')->put('/appointments/{id}/notes', [AppointmentController::class,'updateNotes']);

Route::middleware('auth:sanctum')->get('/dashboard',[DashboardController::class,'index']);
Route::middleware('auth:sanctum')->get('/profile',[DashboardController::class,'profile']);
Route::middleware('auth:sanctum')->put('/profile',[DashboardController::class,'updateprofile']);

Route::middleware('auth:sanctum')->put('/updatepassword',[DashboardController::class,'updatePassword']);

Route::middleware('auth:sanctum')->get('/users', [UserController::class,'index']);

Route::middleware('auth:sanctum')->post('/users', [UserController::class,'store']);

Route::middleware('auth:sanctum')->put('/users/{id}/status', [UserController::class,'updateStatus']);

Route::middleware('auth:sanctum')->get('/users/{id}', [UserController::class,'show']);

Route::middleware('auth:sanctum')->put('/users/{id}', [UserController::class,'update']);

Route::middleware('auth:sanctum')->delete('/users/{id}', [UserController::class,'destroy']);

Route::middleware('auth:sanctum')->get('/astrologers',[UserController::class,'astrologers']);

Route::middleware('auth:sanctum')->get('/slots', [AvailabilityController::class,'index']);

Route::middleware('auth:sanctum')->post('/slots', [AvailabilityController::class,'store']);

Route::middleware('auth:sanctum')->get('/slots/{id}', [AvailabilityController::class,'show']);

Route::middleware('auth:sanctum')->put('/slots/{id}', [AvailabilityController::class,'update']);

Route::middleware('auth:sanctum')->delete('/slots/{id}', [AvailabilityController::class,'destroy']);