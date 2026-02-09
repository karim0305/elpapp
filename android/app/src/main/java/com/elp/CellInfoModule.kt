package com.elp

import android.content.Context
import android.telephony.*
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CellInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CellInfoModule"
    }

    @ReactMethod
    fun getCellInfo(promise: Promise) {
        try {
            val tm = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            val cellInfos = tm.allCellInfo
            val result = Arguments.createArray()

            for (cellInfo in cellInfos) {
                if (cellInfo.isRegistered) {
                    val map = Arguments.createMap()

                    when (cellInfo) {
                        is CellInfoGsm -> {
                            val cell = cellInfo.cellIdentity
                            val signal = cellInfo.cellSignalStrength
                            map.putString("type", "GSM")
                            map.putInt("cellId", cell.cid)
                            map.putInt("lac", cell.lac)
                            map.putInt("signalDbm", signal.dbm)
                        }
                        is CellInfoLte -> {
                            val cell = cellInfo.cellIdentity
                            val signal = cellInfo.cellSignalStrength
                            map.putString("type", "LTE")
                            map.putInt("cellId", cell.ci)
                            map.putInt("tac", cell.tac)
                            map.putInt("signalDbm", signal.dbm)
                        }
                        is CellInfoNr -> { // 5G
                            val cell = cellInfo.cellIdentity as CellIdentityNr
                            val signal = cellInfo.cellSignalStrength as CellSignalStrengthNr
                            map.putString("type", "NR_5G")
                            map.putLong("cellId", cell.nci)
                            map.putInt("tac", cell.tac)
                            map.putInt("signalDbm", signal.dbm)
                        }
                    }

                    result.pushMap(map)
                }
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("CELL_ERROR", e)
        }
    }
}
