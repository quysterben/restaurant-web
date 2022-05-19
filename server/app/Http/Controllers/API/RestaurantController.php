<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Validator as FacadesValidator;

use function PHPSTORM_META\map;

class RestaurantController extends Controller
{
    public function store(Request $request) {
        $validator = FacadesValidator::make($request->all(), [
            'name' => 'required',
            'address' => 'required',
            'description' => 'required',
            'phoneNumber' => 'required',
            'img' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {
            $hashedTooken = $request->bearerToken();
            $token = PersonalAccessToken::findToken($hashedTooken);
            $user = $token->tokenable;

            $newRestaurant = new Restaurant();
            $newRestaurant->name = $request->input('name');
            $newRestaurant->address = $request->input('address');
            $newRestaurant->phoneNumber = $request->input('phoneNumber');
            $newRestaurant->description = $request->input('description');

            if($request->hasFile('img')) {
                $path = $request->file('img')->store('public/restaurants');
                $image_path = env('APP_URL').':8000/'.'storage/'.substr($path, strlen('public/'));
                $newRestaurant->img = $image_path;
            }

            $newRestaurant->userName = $user->name;
            $newRestaurant->userId = $user->id;
            $newRestaurant->save();

            return response()->json([
                'status' => 200,
                'message' => 'Added',
            ]);            
        }
    }

    public function index() {
        $restaurants = Restaurant::all();
        return response()->json([
            'status' => 200,
            'restaurants' => $restaurants,
        ]);
    }

    public function indexUser() {
        $userId = Auth()->user()->id;
        $restaurants = Restaurant::where('userId', $userId)->get();
        return response()->json([
            'status' => 200,
            'restaurants' => $restaurants,
        ]);
    }

    public function getToView($id) {
        $restaurant = Restaurant::find($id);
        if ($restaurant) {
            return response()->json([
                'status' => 200,
                'restaurant' => $restaurant,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Restaurant not found!',
            ]);
        }
    }

    public function getToEdit($id) {
        $userId = Auth()->user()->id;
        $restaurant = Restaurant::where('userId', $userId)->find($id);
        if ($restaurant) {
            return response()->json([
                'status' => 200,
                'restaurant' => $restaurant,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'data' => 'Restaurant not found!',
            ]);
        }
    }

    public function update(Request $request, $id) {
        $validator = FacadesValidator::make($request->all(), [
            'name' => 'required',
            'address' => 'required',
            'description' => 'required',
            'phoneNumber' => 'required',
            'img' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {
            $user = Auth()->user();
            $restaurant = Restaurant::where('userId', $user->id)->find($id);
            $restaurant->name = $request->input('name');
            $restaurant->address = $request->input('address');
            $restaurant->phoneNumber = $request->input('phoneNumber');
            $restaurant->description = $request->input('description');

            if($request->hasFile('img')) {
                $path = $request->file('img')->store('public/restaurants');
                $image_path = env('APP_URL').':8000/'.'storage/'.substr($path, strlen('public/'));
                $restaurant->img = $image_path;
            } else {
                $restaurant->img = $request->input('img');
            }

            $restaurant->userName = $user->name;
            $restaurant->update();

            return response()->json([
                'status' => 200,
                'message' => 'Restaurant Updated Successfully!',
            ]);            
        }
    }

    public function destroy($id) {
        $restaurant = Restaurant::find($id);
        Storage::delete('public/restaurants' . $restaurant->img);
        $restaurant->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Restaurant deleted successfully!',
        ]);
    }
}