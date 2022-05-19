<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RestaurantController;
use App\Models\Restaurant;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('/restaurant/{id}', [RestaurantController::class, 'getToView']);
Route::get('/restaurants', [RestaurantController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    //Edit
    Route::get('/edit-restaurant/{id}', [RestaurantController::class, 'getToEdit']);
    Route::put('/edit-restaurant/{id}', [RestaurantController::class, 'update']);

    //Add
    Route::post('/add-restaurant', [RestaurantController::class, 'store']);

    //Get User's Restaurant
    Route::get('/restaurantsUser', [RestaurantController::class, 'indexUser']);

    //Delete Restaurant
    Route::delete('/delete-restaurant/{id}', [RestaurantController::class, 'destroy']);
});