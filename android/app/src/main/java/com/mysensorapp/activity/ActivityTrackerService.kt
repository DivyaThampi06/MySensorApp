package com.mysensorapp

import android.app.Service
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.os.SystemClock
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class ActivityTrackerService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null

    private var stepCount = 0
    private var lastStepTimestamp = 0L
    private var lastActivity = "Stationary"

    private val accelerationThreshold = 11.0f
    private val runningThreshold = 14.0f

    private val reactContext: ReactContext?
        get() {
            val application = applicationContext as? ReactApplication
            return application?.reactNativeHost?.reactInstanceManager?.currentReactContext
        }

    override fun onCreate() {
        super.onCreate()

        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onSensorChanged(event: SensorEvent?) {
        event ?: return

        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]

        val acceleration = Math.sqrt((x * x + y * y + z * z).toDouble()).toFloat()

        val currentTime = SystemClock.elapsedRealtime()

        if (acceleration > accelerationThreshold) {
            if (currentTime - lastStepTimestamp > 300) {
                stepCount++
                lastStepTimestamp = currentTime

                val newActivity = if (acceleration > runningThreshold) "Running" else "Walking"

                if (newActivity != lastActivity) {
                    lastActivity = newActivity
                    sendActivityUpdate()
                } else {
                    sendActivityUpdate()
                }
            }
        } else {
            if (currentTime - lastStepTimestamp > 6000 && lastActivity != "Stationary") {
                lastActivity = "Stationary"
                sendActivityUpdate()
            }
        }
    }

    private fun sendActivityUpdate() {
        val params = mapOf(
            "activity" to lastActivity,
            "steps" to stepCount
        )

        reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("ActivityUpdate", params)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
