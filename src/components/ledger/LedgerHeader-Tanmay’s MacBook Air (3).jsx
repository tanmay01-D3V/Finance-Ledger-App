import { useEffect, useState } from "react";
import axios from "axios";

const LedgerHeader = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get(
          "https://api.quotable.io/random"
        );

        setQuote(res.data.content);
      } catch {
        setQuote(
          "Financial freedom is available to those who learn about it and work for it."
        );
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="mb-10">

      <h1 className="text-[52px] leading-[58px] font-bold text-gray-900">
        Financial Ledger
      </h1>

      <div className="mt-5 border-l-4 border-green-600 pl-6">
        <p className="text-xl italic text-gray-600 leading-8">
          "{quote}"
        </p>
      </div>

    </div>
  );
};

export default LedgerHeader;