
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <motion.header 
      className="w-full py-6 px-8 flex items-center justify-between glass border-b z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link to="/" className="flex items-center gap-2 group">
        <motion.div
          className="bg-accent rounded-lg p-2 text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="h-5 w-5" />
        </motion.div>
        <motion.span 
          className="text-xl font-medium tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          AI Analysis Portal
        </motion.span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
          Início
        </Link>
        <Link to="/sobre" className="text-sm font-medium hover:text-accent transition-colors">
          Sobre
        </Link>
      </nav>
    </motion.header>
  );
};

export default Header;
