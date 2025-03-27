
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, SearchCheck, BrainCircuit } from "lucide-react";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    setIsVisible(true);
  });

  const features = [
    {
      title: "Análise de Laudo",
      description: "Utilize nossa IA avançada para analisar laudos e detectar inconsistências automaticamente.",
      icon: <FileText className="h-5 w-5" />,
      path: "/analise-laudo"
    },
    // Outros cards podem ser adicionados no futuro
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 md:px-6 py-12">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 text-sm text-accent mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <BrainCircuit className="mr-1 h-3.5 w-3.5" />
            Inteligência Artificial
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Análise Inteligente
            <span className="text-accent"> SE7I </span>
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Utilize o poder da inteligência artificial para analisar laudos 
            e obter dados precisos e automatizados.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              delay={index}
            />
          ))}
        </motion.div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI SE7I. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
