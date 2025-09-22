<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use App\Models\ActivityLogs;
use App\Models\Notification;
use App\Models\PregnancyTracking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdatePregnancyTrackingTrimester extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-trimester';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update pregnancy_status field based on LMP weeks and log results';

    /**
     * Execute the console command.
     */


    public function handle()
    {
        // --- Count pregnancies before update ---
        $totalPregnancies = PregnancyTracking::count();

        // --- Bulk updates ---
        $first = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) <= 12')
            ->update(['pregnancy_status' => 'first_trimester']);

        $second = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) BETWEEN 13 AND 27')
            ->update(['pregnancy_status' => 'second_trimester']);

        $third = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) BETWEEN 28 AND 40')
            ->update(['pregnancy_status' => 'third_trimester']);

        $completed = PregnancyTracking::whereRaw('TIMESTAMPDIFF(WEEK, lmp, CURDATE()) > 40')
            ->update(['pregnancy_status' => 'completed']);

        // --- Build message ---
        $message = "Pregnancy statuses updated successfully today (" . Carbon::today()->toDateString() . ").\n\n";
        $message .= "Out of {$totalPregnancies} pregnancies:\n";
        $message .= "• {$first} set to First Trimester\n";
        $message .= "• {$second} set to Second Trimester\n";
        $message .= "• {$third} set to Third Trimester\n";
        $message .= "• {$completed} set to Completed\n";

        $notifMessage = "Pregnancy statuses updated today: {$first} first, {$second} second, {$third} third, {$completed} completed.";

        // --- Fire event for broadcast ---
        event(new UserNotified($notifMessage));

        // --- Log activity ---
        $systemUserId = User::where('email', 'system@gmail.com')->value('id');

        ActivityLogs::create([
            'user_id' => $systemUserId,
            'action' => 'scheduler',
            'title' => 'Automated Pregnancy Trimester Update',
            'info' => [
                'first_trimester'  => $first,
                'second_trimester' => $second,
                'third_trimester'  => $third,
                'completed'        => $completed,
                'total'            => $totalPregnancies,
                'message'          => $message,
                'date'             => Carbon::today(),
            ],
            'loggable_type' => PregnancyTracking::class,
            'loggable_id' => null,
            'ip_address' => 'system',
            'user_agent' => 'scheduler',
        ]);

        // --- Notify users (except role_id = 2) ---
        $users = User::select('id')->where('role_id', '!=', 2)->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title'   => 'Pregnancy Trimester Update',
                'message' => $message,
            ]);
        }

        $this->info($notifMessage);
    }
}
