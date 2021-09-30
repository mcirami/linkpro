<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeSubscriptionTableColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('stripe_id');
            $table->dropColumn('stripe_status');
            $table->dropColumn('stripe_price');
            $table->dropColumn('quantity');
            $table->string('braintree_id');
            $table->string('braintree_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('stripe_id');
            $table->string('stripe_status');
            $table->string('stripe_price');
            $table->integer('quantity');
            $table->dropColumn('braintree_id');
            $table->dropColumn('braintree_status');
        });
    }
}
