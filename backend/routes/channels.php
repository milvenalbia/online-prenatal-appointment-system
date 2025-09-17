<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications', function () {
    // Public channel - anyone can listen
    return true;
});
