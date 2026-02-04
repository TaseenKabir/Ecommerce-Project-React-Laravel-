<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    // Append the accessor to JSON
    protected $appends = ['image_url'];

    // Accessor to get full image URL
    public function getImageUrlAttribute()
    {
        if ($this->image == "") {
            return "";
        }

        return asset('/uploads/products/small/' . $this->image);
    }
}
