import SwiftUI

enum LoadState<Value> {
    case loading
    case loaded(Value)
    case failed(String)
}

struct ErrorStateView: View {
    let message: String
    let retry: () async -> Void

    var body: some View {
        ContentUnavailableView {
            Label("Couldn't load", systemImage: "exclamationmark.triangle")
        } description: {
            Text(message)
        } actions: {
            Button("Try again") { Task { await retry() } }
        }
    }
}
