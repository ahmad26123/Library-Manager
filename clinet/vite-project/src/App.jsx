import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/NavBar'
import BooksPage from './Pages/BooksPage'
import AuthorsPage from './Pages/AuthorsPage'
import BorrowsPage from './pages/BorrowPage'

// تم استعمال ال AI لاخذ اوامر الدوكمنت للتنسيق من التيلوين 
// لان العملية تاخذ وقت كتير مشان اخد اوامر التيلون و اكتبن وحدة وحدة 

// +

// الطريقة التي يجب اتباعها لتنسيق الملفات و تسميتها بحيث يكون اكلن شي ممكن 



// شكرا جزيلا ....
// مع تمنياتي بالتائهل الى البوت كامب 
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
