<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // return all categories
    public function index() {
        $categories = Category::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data' =>$categories
        ]);
    }

    // store category in database
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $category = new Category();
        $category->category_name = $request->category_name;
        $category->save();

        return response()->json([
            'status' => 200,
            'message' => 'Category added successfully',
            'data' => $category
        ], 200);
    }


    // show category
    public function show($id) {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $category
        ], 200);

    }

    // update category
    public function update($id, Request $request) {

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
        'category_name' => 'required'
    ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $category->category_name = $request->category_name;
        $category->category_slug = Str::slug($request->category_name);
        $category->save();

        return response()->json([
            'status' => 200,
            'message' => 'Category updated successfully',
            'data' => $category
        ], 200);
    }

    // delete category
    public function destroy($id) {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Category deleted successfully!'
        ], 200);
    }

}
