<?php

namespace App\Http\Controllers\API;

use App\Models\Role;
use App\Models\User;
use App\Models\Gender;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    public function fetchUsers(Request $request) 
    {
        $query = User::query();

        $query->where('id', '!=', auth()->id());

        if ($search = $request->get('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
    
        $users = $query->paginate(10);
    
        return response()->json([
            'users' => $users
        ], 200); // Success
    }

    public function fetchGenders(Request $request)
    {
        $genders = Gender::all();

        return response()->json([
            'genders' => $genders
        ], 200); // Success
    }

    public function fetchRoles(Request $request)
    {
        $roles = Role::all();

        return response()->json([
            'roles' => $roles
        ], 200); // Success
    }

    public function store(Request $request)
    {
        try {

            $validated_data = $request->validate([
                'avatar' => 'nullable|mimes:jpeg,png,jpg,gif,webp|max:5096',
                'name' => 'required|string|max:255',
                'gender' => 'required|exists:tbl_genders,id',
                'email' => 'required|email|unique:tbl_users,email',
                'password' => 'required|string|min:8|confirmed',
                'role_type' => 'required|exists:tbl_roles,id',
            ]);

            $validated_data['gender_id'] = $validated_data['gender'];
            $validated_data['role_id'] = $validated_data['role_type'];
            $validated_data['password'] = bcrypt($validated_data['password']);

            unset($validated_data['gender'], $validated_data['role_type']);

            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $fileName = $file->getClientOriginalName();
                $file->storeAs('avatars', $fileName, 'public');
                $validated_data['avatar'] = $fileName;
            }
            
            User::create($validated_data);

            return response()->json([
                'message' => 'User created successfully.',
                'status' => 'success'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user.',
                'status' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, string $user_id)
    {
        try {
            $user = User::findOrFail($user_id);

            return response()->json([
                'message' => 'User found.',
                'status' => 'success',
                'user' => $user,
            ], 200);

        } catch (\Exception $e) 
        {
            return response()->json([
                'message' => 'User not found.',
                'status' => 'error'
            ], 500);
        }
    }

    public function update(Request $request, string $user_id)
    {   
        try {

            $user = User::findOrFail($user_id);

            $validated_data = $request->validate([
                'avatar' => 'nullable|mimes:jpeg,png,jpg,gif,webp|max:5096',
                'name' => 'required|string|max:255',
                'gender' => 'required|exists:tbl_genders,id',
                'email' => 'required|email|unique:tbl_users,email,' . $user->id . ',id',
                'password' => 'nullable|string|min:8|confirmed',
                'role_type' => 'required|exists:tbl_roles,id',
            ]);

            if ($request->hasFile('avatar')) {
                if ($user->avatar) {
                    Storage::disk('public/avatars')->delete($user->avatar);
                }
                $file = $request->file('avatar');
                $fileName = $file->getClientOriginalName();
                $file->storeAs('avatars', $fileName, 'public');
                $validated_data['avatar'] = $fileName;
            }

            if (!empty($validated_data['password'])) {
                $user->password = bcrypt($validated_data['password']);
            }

            $user->update([
                'name' => $validated_data['name'],
                'email' => $validated_data['email'],
                'gender' => $validated_data['gender'],
                'role_type' => $validated_data['role_type'],
                'avatar' => $validated_data['avatar'] ?? $user->avatar,
            ]);

            $user->save();

            return response()->json([
                'message' => 'User updated successfully',
                'status' => 'success',
                'user' => $user,

            ], 200);
            
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'message' => 'User not found.',
                'status' => 'error'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function destroy(string $user_id)
    {
        try {

            $user = User::findOrFail($user_id);

            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully',
                'status' => 'success',
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'message' => 'User not found.',
                'status' => 'error'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

}
