<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function  login(Request $request) {
        
        $validated_credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'max:15'],
        ]);

        if(!Auth::attempt($validated_credentials)) {
            return response()->json([
                'message' => 'Invalid credentials, please try again.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login Successful',
            'token' => $token,
            'user' => $user,
        ], 200);
    }
}
