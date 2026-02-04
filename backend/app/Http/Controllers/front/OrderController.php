<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class OrderController extends Controller
{
    public function saveOrder(Request $request) {

        if (!empty($request->cart)) {
            // Save order in database
            $order = new Order();
            $order->name = $request->name;
            $order->email = $request->email;
            $order->address = $request->address;
            $order->city = $request->city;
            $order->district = $request->district;
            $order->zip = $request->zip;
            $order->mobile = $request->mobile;
            $order->total = $request->total;
            $order->subtotal = $request->subtotal;
            $order->discount = $request->discount;
            $order->shipping = $request->shipping;
            $order->payment_status = $request->payment_status;
            $order->status = $request->status;
            $order->user_id = $request->user()->id;
            $order->save();

            // Save order items

            foreach ($request->cart as $item) {
                $orderItem = new OrderItem();
                $orderItem->order_id = $order->id;
                $orderItem->price = $item['quantity'] * $item['price'];
                $orderItem->unit_price = $item['price'];
                $orderItem->qty = $item['quantity'];
                $orderItem->product_id = $item['product_id'];
                $orderItem->size = $item['size'];
                $orderItem->name = $item['title'];
                $orderItem->save();                
            }

            return response()->json([
                'status' => 200,
                'id' => $order->id,
                'message' => 'Your order has been successfully placed!'
            ],200);

        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Your cart is empty!'
            ],400);
        }
    }

    public function createPaymentIntent(Request $request) {
        try {
            
            if ($request->amount > 0) {

                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

                $paymentIntent = PaymentIntent::create([
                    'amount' => $request->amount,
                    'currency' => 'USD',
                    'payment_method_types' => ['card']
                ]);

                $clientSecret = $paymentIntent->client_secret;

                return response()->json([
                    'status' => 200,
                    'clientSecret' => $clientSecret
                ],200);

            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Amount must be greater than 0'
                ],400);
            }

        } catch (\Exception $e) {
            //throw $th;
        }
    }
}
