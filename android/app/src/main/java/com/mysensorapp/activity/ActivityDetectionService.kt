package com.mysensorapp

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import androidx.localbroadcastmanager.content.LocalBroadcastManager

class AndroidDetectionService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)

        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
        gyroscope?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("AndroidDetectionService", "Service started")
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
        Log.d("AndroidDetectionService", "Service stopped")
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            when (it.sensor.type) {
                Sensor.TYPE_ACCELEROMETER -> {
                    val x = it.values[0]
                    val y = it.values[1]
                    val z = it.values[2]
                    val activity = detectActivity(x, y, z)
                    sendActivityUpdate(activity)
                }
                Sensor.TYPE_GYROSCOPE -> {
                           }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun detectActivity(x: Float, y: Float, z: Float): String {
        val magnitude = Math.sqrt((x * x + y * y + z * z).toDouble())
        return when {
            magnitude < 1.5 -> "Stationary"
            magnitude < 3 -> "Walking"
            else -> "Running"
        }
    }

    private fun sendActivityUpdate(activity: String) {
        val intent = Intent("ActivityUpdate")
        intent.putExtra("activity", activity)
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent)
    }
}
