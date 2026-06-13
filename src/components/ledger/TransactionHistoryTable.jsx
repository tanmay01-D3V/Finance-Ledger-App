import {
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const transactions = [
  {
    date: "Oct 24, 2023",
    title: "DigitalOcean Cloud",
    subtitle: "Infrastructure & Server Hosting",
    category: "Expense: Variable",
    amount: "-$1,240.50",
    type: "expense",
    status: "completed",
  },
  {
    date: "Oct 23, 2023",
    title: "Stripe Payout",
    subtitle: "Merchant Processing #9923",
    category: "Income: Recurring",
    amount: "+$12,450.00",
    type: "income",
    status: "completed",
  },
  {
    date: "Oct 22, 2023",
    title: "Slack Technologies",
    subtitle: "Internal Communications",
    category: "Expense: Fixed",
    amount: "-$450.00",
    type: "expense",
    status: "completed",
  },
  {
    date: "Oct 21, 2023",
    title: "Angel Round Funding",
    subtitle: "Capital Injection - Series Seed",
    category: "Income: Equity",
    amount: "+$250,000.00",
    type: "income",
    status: "pending",
  },
];

const TransactionHistoryTable = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">

      {/* Header */}

      <div className="flex justify-between items-center p-8 border-b">

        <h2 className="text-4xl font-bold">
          Transaction History
        </h2>

        <div className="flex gap-4">

          <button className="flex items-center gap-2 px-5 py-3 border rounded-full">
            <FiCalendar />
            Last 30 Days
          </button>

          <button className="flex items-center gap-2 px-5 py-3 border rounded-full">
            <FiFilter />
            Filter Category
          </button>

          <button className="flex items-center gap-2 px-5 py-3 border rounded-full">
            <FiDownload />
            Export
          </button>

        </div>

      </div>

      {/* Table */}

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left">

            <th className="p-6">DATE</th>
            <th className="p-6">DESCRIPTION</th>
            <th className="p-6">CATEGORY</th>
            <th className="p-6">AMOUNT</th>
            <th className="p-6">STATUS</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((item, index) => (
            <tr
              key={index}
              className="border-t"
            >
              <td className="p-6 text-xl">
                {item.date}
              </td>

              <td className="p-6">
                <p className="font-bold text-xl">
                  {item.title}
                </p>

                <p className="text-gray-500">
                  {item.subtitle}
                </p>
              </td>

              <td className="p-6">

                <span
                  className={`px-4 py-2 rounded-full font-medium ${
                    item.type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.category}
                </span>

              </td>

              <td
                className={`p-6 text-2xl font-bold ${
                  item.type === "income"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {item.amount}
              </td>

              <td className="p-6">

                {item.status === "completed" ? (
                  <FiCheckCircle
                    className="text-green-700"
                    size={28}
                  />
                ) : (
                  <FiClock
                    className="text-gray-400"
                    size={28}
                  />
                )}

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* Footer */}

      <div className="flex justify-between items-center p-8 border-t">

        <p className="text-gray-600 font-medium">
          Showing 1 to 5 of 128 entries
        </p>

        <div className="flex items-center gap-3">

          <button className="w-12 h-12 border rounded-xl flex items-center justify-center">
            <FiChevronLeft />
          </button>

          <button className="w-12 h-12 bg-black text-white rounded-xl">
            1
          </button>

          <button className="w-12 h-12">
            2
          </button>

          <button className="w-12 h-12">
            3
          </button>

          <button className="w-12 h-12 border rounded-xl flex items-center justify-center">
            <FiChevronRight />
          </button>

        </div>

      </div>

    </div>
  );
};

export default TransactionHistoryTable;