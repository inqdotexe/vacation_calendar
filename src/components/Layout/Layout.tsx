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
          <aside className="w-80 border-r bg-card p-3 min-h-[calc(100vh-56px)] overflow-y-auto">
            {sidebar}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-x-auto">
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
