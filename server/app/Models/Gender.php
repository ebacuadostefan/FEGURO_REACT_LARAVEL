<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    protected $table = 'tbl_genders';
    protected $fillable = [
        'gender'
    ];
}
