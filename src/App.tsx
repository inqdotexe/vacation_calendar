import { Layout } from '@/components/Layout/Layout'
import { Header } from '@/components/Layout/Header'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Calendar } from '@/components/Calendar/Calendar'
import { VacationList } from '@/components/Vacations/VacationList'

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
      <div className="space-y-6">
        <Calendar />
        <VacationList />
      </div>
    </Layout>
  )
}

export default App
