
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, path, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-black/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-500 border border-border/60 hover:border-accent/20 group"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 + 0.3, duration: 0.5 }}
    >
      <Link to={path} className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {description}
        </p>
        <div className="text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
          Acessar
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeatureCard;
