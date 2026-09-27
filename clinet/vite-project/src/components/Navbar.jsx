import { Link } from 'react-router';

function Navbar() {
    return (
        <nav className="bg-slate-800 text-white p-4 flex gap-6 shadow-md ">
            <Link to="/" className="hover:text-blue-400 transition-colors"> (Books)</Link>
            <Link to="/authors" className="hover:text-blue-400 transition-colors"> (Authors)</Link>
            <Link to="/borrows" className="hover:text-blue-400 transition-colors"> (Borrows)</Link>
        </nav>
    );
}
export default Navbar;