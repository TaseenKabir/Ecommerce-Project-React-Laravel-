<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Category extends Model
{
    use Sluggable;

    protected $fillable = ['category_name', 'category_image', 'category_slug'];
    
    // Append the accessor to JSON
    protected $appends = ['image_url'];

    // Accessor to get full image URL
    public function getImageUrlAttribute()
    {
        if ($this->category_image == "") {
            return "";
        }

        return asset('/images/categories/' . $this->category_image);
    }

    public function sluggable(): array
    {
        return [
            'category_slug' => [
                'source' => 'category_name'
            ]
        ];
    }
}
