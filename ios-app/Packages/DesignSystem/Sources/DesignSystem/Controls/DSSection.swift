//
//  DSSection.swift
//  DesignSystem
//

import SwiftUI

/// A form section container with optional header and footer.
public struct DSSection<Header: View, Content: View, Footer: View>: View {
    let header: Header
    let content: Content
    let footer: Footer

    /// Creates a section with custom header, content, and footer.
    public init(
        @ViewBuilder header: () -> Header,
        @ViewBuilder content: () -> Content,
        @ViewBuilder footer: () -> Footer
    ) {
        self.header = header()
        self.content = content()
        self.footer = footer()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            header
            content
            footer
        }
    }
}

extension DSSection where Header == EmptyView {
    /// Creates a section without a header.
    public init(
        @ViewBuilder content: () -> Content,
        @ViewBuilder footer: () -> Footer
    ) {
        self.header = EmptyView()
        self.content = content()
        self.footer = footer()
    }
}

extension DSSection where Footer == EmptyView {
    /// Creates a section without a footer.
    public init(
        @ViewBuilder header: () -> Header,
        @ViewBuilder content: () -> Content
    ) {
        self.header = header()
        self.content = content()
        self.footer = EmptyView()
    }
}

extension DSSection where Header == EmptyView, Footer == EmptyView {
    /// Creates a section with content only.
    public init(@ViewBuilder content: () -> Content) {
        self.header = EmptyView()
        self.content = content()
        self.footer = EmptyView()
    }
}
