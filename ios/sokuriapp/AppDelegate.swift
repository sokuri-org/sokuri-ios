import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  var bridge: RCTBridge?
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {

    guard let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index") else {
      fatalError("jsCodeLocation is nil")
    }

    let rootView = RCTRootView(
      bundleURL: jsCodeLocation,
      moduleName: "sokuriapp",
      initialProperties: nil,
      launchOptions: launchOptions
    )

    let rootViewController = UIViewController()
    rootViewController.view = rootView

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()

    return true
  }
}
