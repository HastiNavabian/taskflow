// این فایل عمداً خیلی ساده‌ست.
// قراره فاز به فاز، با هم اینو بسازیم:
// فاز ۲: Board با ستون‌ها و mock data (Data Flow)
// فاز ۳: useEffect برای فچ دیتا (Hooks)
// فاز ۴: کامپوننت‌های reusable مثل Card, Modal (Composition)
// فاز ۵: اتصال به Rest API واقعی
// فاز ۶: TanStack Query + Zustand
import Column from './features/tasks/components/Column'
import mockTasks from './features/tasks/mockTasks'
function App() {
  const notStartedTasks = mockTasks.filter((task) => task.status === "not-started")
  const inProgressTasks = mockTasks.filter((task)=> task.status === "in-progress")
  const completedTasks = mockTasks.filter((task)=> task.status === "completed")
  return (
    <div>
      <Column title="آماده شروع" tasks={notStartedTasks} />
      <Column title="در حال انجام" tasks={inProgressTasks} />
      <Column title="تکمیل شده" tasks={completedTasks} />
    </div>
  )
}

export default App
