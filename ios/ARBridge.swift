import Foundation
import React

@objc(ARBridge)
class ARBridge: NSObject {

  @objc
  func getDeviceInfo(_ callback: RCTResponseSenderBlock) {
    let info = UIDevice.current.model
    callback([NSNull(), "This device is: \(info)"])
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
