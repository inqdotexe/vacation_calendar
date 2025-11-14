import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  header?: ReactNode
  sidebar?: ReactNode
  footer?: ReactNode
}

/**
 * Основной layout приложения
 * Grid структура: header, sidebar, main content, footer
 */
export function Layout({ children, header, sidebar, footer }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {header && (
        <header className="border-b bg-card">
          {header}
        </header>
      )}

      {/* Main content with sidebar */}
      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-80 border-r bg-card p-4 min-h-[calc(100vh-64px)] overflow-y-auto">
            {sidebar}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t bg-card p-4">
          {footer}
        </footer>
      )}
    </div>
  )
}
