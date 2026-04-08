//
//  SchemaV1.swift
//  MaltaCalculator
//

import Foundation
import SwiftData

/// Versioned schema describing the v1 persistent store.
///
/// Adding a field or model in a future release means introducing a new
/// `V2Schema` and appending a `MigrationStage` to
/// ``MaltaCalculatorMigrationPlan``.
enum V1Schema: VersionedSchema {
    static var versionIdentifier: Schema.Version {
        Schema.Version(1, 0, 0)
    }

    static var models: [any PersistentModel.Type] {
        [
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self
        ]
    }
}

/// Migration plan scaffold. Currently only hosts V1 — subsequent
/// releases append `MigrationStage` entries here.
enum MaltaCalculatorMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] {
        [V1Schema.self]
    }

    static var stages: [MigrationStage] {
        []
    }
}
