import { BrowserRouter as Router } from "react-router-dom"
import { Footer, Header } from "./app/layouts"
import { QueryProvider } from "./app/providers"
import "./index.css"
import { PostsManagerPage } from "./pages"

const App = () => {
  return (
    <QueryProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  )
}

export default App
