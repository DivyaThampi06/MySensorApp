package com.mysensorapp

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Intent
import android.location.Location
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import android.os.Looper
import androidx.annotation.RequiresPermission
import com.facebook.react.bridge.WritableMap
class ActivityModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null
    private var currentActivity = "Stationary"  // Default activity
    private var fusedLocationClient: FusedLocationProviderClient? = null
    private var lastLocation: Location? = null
    private var totalDistance = 0f
    init {
        sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager?.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
    }

    override fun getName(): String {
        return "ActivityBridge"
    }

    @ReactMethod
    fun startTracking() {
        sensorManager?.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI)
        sensorManager?.registerListener(this, gyroscope, SensorManager.SENSOR_DELAY_UI)
    }

    @ReactMethod
    fun stopTracking() {
        sensorManager?.unregisterListener(this)
    }

    @ReactMethod
    fun getCurrentActivity(callback: Callback) {
        callback.invoke(currentActivity)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return

        if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            val movementThreshold = 1.0f
            val acceleration = Math.sqrt(
                (event.values[0] * event.values[0] + event.values[1] * event.values[1] + event.values[2] * event.values[2]).toDouble()
            ).toFloat()

            val newActivity = if (acceleration > movementThreshold) {
                "Walking"
            } else {
                "Stationary"
            }


            if (newActivity != currentActivity) {
                currentActivity = newActivity
                sendActivityUpdate(currentActivity)
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {

    }

    private fun sendActivityUpdate(activityData: String) {
        val params = Arguments.createMap()
        params.putString("activityType", activityData)

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("ActivityUpdate", params)
    }
    @SuppressLint("ScheduleExactAlarm")
    fun scheduleMedicineReminder(context: Context, reminderTimeMillis: Long) {
        val intent = Intent(context, MedicineReminderReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            reminderTimeMillis - (15 * 60 * 1000), // srtting to 15 minutes before
            pendingIntent
        )
    }
    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    fun startLocationUpdates(context: Context) {
    fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

    val locationRequest = LocationRequest.create().apply {
        interval = 5000
        fastestInterval = 3000
        priority = LocationRequest.PRIORITY_HIGH_ACCURACY
    }

    val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            val location = locationResult.lastLocation ?: return

            if (lastLocation != null) {
                totalDistance += lastLocation!!.distanceTo(location)
            }
            lastLocation = location


            val params = Arguments.createMap()
            params.putDouble("latitude", location.latitude)
            params.putDouble("longitude", location.longitude)
            params.putDouble("distance", totalDistance.toDouble())

            sendEvent("LocationUpdate", params)
        }
    }

    fusedLocationClient?.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper())
}

private fun sendEvent(eventName: String, params: WritableMap?) {
    reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
}

}
