"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
}

function calculateMortgage(
  loanAmount: number,
  annualRate: number,
  years: number
): { monthlyPayment: number; schedule: AmortizationRow[] } {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / numPayments
      : (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let totalPrincipal = 0;
  let totalInterest = 0;

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    totalPrincipal += principalPayment;
    totalInterest += interestPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      totalPrincipal,
      totalInterest,
    });
  }

  return { monthlyPayment, schedule };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const COLORS = ["#3b82f6", "#ef4444"];

export default function MortgagePage() {
  const [loanAmount, setLoanAmount] = useState(400000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const { monthlyPayment, schedule } = useMemo(
    () => calculateMortgage(loanAmount, interestRate, loanTerm),
    [loanAmount, interestRate, loanTerm]
  );

  const totalPaid = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPaid - loanAmount;

  const pieData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
  ];

  // Sample every 12 months for the chart to keep it readable
  const chartData = schedule.filter(
    (row) => row.month % 12 === 0 || row.month === 1
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Mortgage Calculator
        </h1>

        {/* Input Controls */}
        <div className="mb-8 rounded-xl bg-slate-800/50 p-6 shadow-xl backdrop-blur">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Loan Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 py-3 pl-8 pr-4 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  min={0}
                  step={10000}
                />
              </div>
              <input
                type="range"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                min={50000}
                max={2000000}
                step={10000}
                className="mt-2 w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 py-3 px-4 pr-8 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  min={0}
                  max={20}
                  step={0.125}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  %
                </span>
              </div>
              <input
                type="range"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min={0}
                max={15}
                step={0.125}
                className="mt-2 w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Loan Term (years)
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 py-3 px-4 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-blue-600/20 p-6 backdrop-blur">
            <p className="text-sm text-blue-300">Monthly Payment</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-700/50 p-6 backdrop-blur">
            <p className="text-sm text-slate-400">Principal</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(loanAmount)}
            </p>
          </div>
          <div className="rounded-xl bg-red-600/20 p-6 backdrop-blur">
            <p className="text-sm text-red-300">Total Interest</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalInterest)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-700/50 p-6 backdrop-blur">
            <p className="text-sm text-slate-400">Total Cost</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Amortization Chart */}
          <div className="rounded-xl bg-slate-800/50 p-6 shadow-xl backdrop-blur lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Amortization Schedule
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tickFormatter={(value) => `Yr ${Math.ceil(value / 12)}`}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(value) =>
                      `$${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f8fafc" }}
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) =>
                      `Year ${Math.ceil(Number(label) / 12)}`
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="totalPrincipal"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    name="Principal Paid"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalInterest"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    name="Interest Paid"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-xl bg-slate-800/50 p-6 shadow-xl backdrop-blur">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Payment Breakdown
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend
                    wrapperStyle={{ color: "#f8fafc" }}
                    formatter={(value) => (
                      <span style={{ color: "#f8fafc" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="mt-6 rounded-xl bg-slate-800/50 p-6 shadow-xl backdrop-blur">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Yearly Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">Principal</th>
                  <th className="pb-3 pr-4">Interest</th>
                  <th className="pb-3 pr-4">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {schedule
                  .filter((row) => row.month % 12 === 0)
                  .map((row) => (
                    <tr
                      key={row.month}
                      className="border-b border-slate-700/50"
                    >
                      <td className="py-3 pr-4 font-medium">
                        {row.month / 12}
                      </td>
                      <td className="py-3 pr-4">
                        {formatCurrency(row.totalPrincipal)}
                      </td>
                      <td className="py-3 pr-4">
                        {formatCurrency(row.totalInterest)}
                      </td>
                      <td className="py-3 pr-4">
                        {formatCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
