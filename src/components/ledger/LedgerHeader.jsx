// Import React hooks for side effects and state
import { useEffect, useState } from "react";
// Import axios for HTTP requests to the quote API
import axios from "axios";

// Header component for the Ledger page displaying a random motivational quote
const LedgerHeader = () => {
  // State to hold the fetched quote text
  const [quote, setQuote] = useState("");

  // Fetch a random quote on component mount
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Request a random quote from the quotable API
        const res = await axios.get(
          "https://api.quotable.io/random"
        );
        // Store the quote content in state
        setQuote(res.data.content);
      } catch {
        // Fallback quote if the API call fails
        setQuote(
          "Financial freedom is available to those who learn about it and work for it."
        );
      }
    };

    // Invoke the async fetch function
    fetchQuote();
  }, []); // Empty dependency array means this runs once on mount

  // Render the page title and quote block
  return (
    <div className="mb-10">
      {/* Page heading */}
      <h1 className="text-[52px] leading-[58px] font-bold text-gray-900">
        Financial Ledger
      </h1>
      {/* Quote display with a green left border accent */}
      <div className="mt-5 border-l-4 border-green-600 pl-6">
        <p className="text-xl italic text-gray-600 leading-8">
          "{quote}"
        </p>
      </div>
    </div>
  );
};

export default LedgerHeader;