import { Layout } from '@/components/Layout/Layout'
import { Header } from '@/components/Layout/Header'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Calendar } from '@/components/Calendar/Calendar'

/**
 * Main App component
 * Uses Layout with Header, Sidebar and Calendar
 */
function App() {
  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
    >
      <Calendar />
    </Layout>
  )
}

export default App
