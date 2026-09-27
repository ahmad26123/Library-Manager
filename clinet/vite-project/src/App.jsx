import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/NavBar'
import BooksPage from './Pages/BooksPage'
import AuthorsPage from './Pages/AuthorsPage'
import BorrowsPage from './pages/BorrowPage'


const App = () => {
  return (
    <>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' index element={<BooksPage />} />
          <Route path='authors' element={<AuthorsPage />} />
          <Route path='borrows' element={<BorrowsPage />} />
        </Routes>
      </BrowserRouter>      
    </>
  )
}

export default App
