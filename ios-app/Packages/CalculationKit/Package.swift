// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "CalculationKit",
    defaultLocalization: "en",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "CalculationKit", targets: ["CalculationKit"]),
    ],
    targets: [
        .target(
            name: "CalculationKit",
            resources: [.process("Resources")],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]
        ),
        .testTarget(
            name: "CalculationKitTests",
            dependencies: ["CalculationKit"]
        ),
    ]
)
