<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function  login(Request $request) 
    {
        
        $validated_credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => [
                'required', 
                'string',
                Password::min(8)
                        ->letters()
                        ->mixedCase()
                        ->numbers()
                        ->symbols(), 
                'max:16'
            ],
        ]);

        if(!Auth::attempt($validated_credentials)) {
            return response()->json([
                'message' => 'Invalid credentials, please try again.'
            ], 401);
        }

        $user = Auth::user();
        $tokenResult = $user->createToken('auth_token');
        $tokenResult->accessToken->expires_at = now()->addMinutes(1440);
        $tokenResult->accessToken->save();

        $token = $tokenResult->plainTextToken;

        return response()->json([
            'message' => 'Login Successful',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->currentAccessToken()) {
            return response()->json([
                'message' => 'Unauthenticated or token missing.'
            ], 401);
        }

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ], 200);
    }
}
