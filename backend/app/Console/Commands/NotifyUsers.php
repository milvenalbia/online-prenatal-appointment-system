<?php

namespace App\Console\Commands;

use App\Events\UserNotified;
use Illuminate\Console\Command;

class NotifyUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notification to all users via broadcasting';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Example message
        $message = "Hello! This is a scheduled notification.";

        // Fire an event for broadcasting
        event(new UserNotified($message));

        $this->info("Notification event dispatched and broadcast!");
    }
}
