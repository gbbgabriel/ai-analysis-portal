
import { Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ResultItem {
  field: string;
  textValue: string;
  imageValue: string;
  match: boolean;
}

interface ResultTableProps {
  results: ResultItem[];
  observations?: string;
  statusInfo?: string;
}

const ResultTable = ({ results, observations, statusInfo }: ResultTableProps) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="w-full overflow-hidden rounded-xl border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {statusInfo && (
        <motion.div 
          className="p-4 bg-muted/30 border-b text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="font-medium text-foreground">{statusInfo}</p>
        </motion.div>
      )}
      
      <motion.div 
        className="overflow-x-auto"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-3 px-4 text-left text-sm font-medium">Dados</th>
              <th className="py-3 px-4 text-left text-sm font-medium">IA (Texto)</th>
              <th className="py-3 px-4 text-left text-sm font-medium">IA (Imagem)</th>
              <th className="py-3 px-4 text-center text-sm font-medium">Comparativo</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <motion.tr 
                key={index}
                className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                variants={rowVariants}
              >
                <td className="py-3 px-4 text-sm border-t">{result.field}</td>
                <td className="py-3 px-4 text-sm border-t">{result.textValue}</td>
                <td className="py-3 px-4 text-sm border-t">{result.imageValue}</td>
                <td className="py-3 px-4 text-center border-t">
                  {result.match ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {observations && (
        <motion.div 
          className="p-4 bg-destructive/10 border-t text-sm text-destructive"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="font-medium">Observação I.A.:</p>
          <p>{observations}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultTable;
