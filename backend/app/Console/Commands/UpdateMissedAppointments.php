<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use App\Models\ActivityLogs;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateMissedAppointments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-missed-appointments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $appointment_count = Appointment::whereDate('appointment_date', Carbon::today())->count();

        $appointments = Appointment::where('status', 'scheduled')
            ->whereDate('appointment_date', Carbon::today())
            ->get();

        $successCount = $appointments->count();
        $successfulPatients = $appointments->pluck('pregnancy_tracking.fullname')->filter()->toArray();

        // Bulk update
        Appointment::whereIn('id', $appointments->pluck('id'))
            ->update(['status' => 'missed']);

        $message = "Out of {$appointment_count} scheduled appointments today, {$successCount} were missed.";

        if ($successCount > 0) {
            $message .= "\n\nMissed Patients:\n• " . implode("\n• ", $successfulPatients);
        }

        $notifMessage = "Out of {$appointment_count} scheduled appointments today, {$successCount} were missed.";

        event(new UserNotified($notifMessage));

        $systemUserId = User::where('email', 'system@gmail.com')->value('id');

        ActivityLogs::create([
            'user_id' => $systemUserId,
            'action' => 'scheduler',
            'title' => 'Automated Missed Appointment Update',
            'info' => [
                'success_count' => $successCount,
                'message' => $message,
                'date' => Carbon::today(),
            ],
            'loggable_type' => Appointment::class,
            'loggable_id' => null,
            'ip_address' => 'system',
            'user_agent' => 'scheduler',
        ]);

        $users = User::select('id')->where('role_id', '!=', 2)->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title'   => 'Missed Appointment Reminders',
                'message' => $message,
            ]);
        }

        $this->info($notifMessage);
    }
}
