<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TempImage extends Model
{
    // Append the accessor to JSON
    protected $appends = ['image_url'];

    // Accessor to get full image URL
    public function getImageUrlAttribute()
    {
        if ($this->name == "") {
            return "";
        }

        return asset('/uploads/temp/thumb/' . $this->name);
    }
}
