package com.mysensorapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.mysensorapp.utils.NotificationHelper
import com.mysensorapp.R

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent

import android.os.Build
import androidx.core.app.NotificationCompat
import com.mysensorapp.MainActivity


class MedicineReminderReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val medicineName = intent.getStringExtra("medicine_name") ?: "Unknown Medicine"
        val notificationTitle = "Time to take your medicine"
        val notificationMessage = "It's time to take your $medicineName."

        // Create an explicit intent to open the app when the notification is tapped
        val activityIntent = Intent(context, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            activityIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Create a NotificationManager to show the notification
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Set up Notification Channel for Android 8.0 (API level 26) and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "medicine_reminder_channel"
            val channelName = "Medicine Reminder"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(channelId, channelName, importance)
            notificationManager.createNotificationChannel(channel)
        }

        // Build the notification
        val notification = NotificationCompat.Builder(context, "medicine_reminder_channel")
            .setContentTitle(notificationTitle)
            .setContentText(notificationMessage)
            .setSmallIcon(R.mipmap.ic_launcher)  // Use a suitable icon here
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        // Display the notification
        notificationManager.notify(1001, notification)
    }
}
