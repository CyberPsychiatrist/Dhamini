import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { API_ENDPOINTS } from '../api';

const BorrowerPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [creditScoreData, setCreditScoreData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);

  const userName = user?.firstName || user?.name || 'Borrower';

  useEffect(() => {
    fetchCreditScore();
    fetchLoans();
    fetchRepayments();
  }, []);

  const fetchCreditScore = async () => {
    try {
      const response = await api.get('/credit-score/me');
      if (response.data?.success) {
        setCreditScoreData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch credit score:', error);
      setCreditScoreData({
        score: 400,
        tier: 'D',
        tierDescription: 'Building credit history',
        estimatedCreditLimit: 10000,
        breakdown: {
          repaymentConsistency: { value: 0 },
          historyDepth: { value: 0 },
          creditUtilization: { value: 100 },
          incomeStability: { value: 0 },
          institutionDiversity: { value: 0 },
          fraudDisputeRecord: { value: 100 }
        },
        stats: {
          totalRepayments: 0,
          onTimeRepayments: 0,
          lateRepayments: 0,
          missedRepayments: 0,
          activeLoans: 0,
          completedLoans: 0
        },
        improvementTips: ['Make on-time repayments to build your credit score']
      });
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans/my');
      if (response.data?.success) {
        setLoans(response.data.loans || []);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    }
  };

  const fetchRepayments = async () => {
    try {
      const response = await api.get('/repayments/my');
      if (response.data?.success) {
        setRepayments(response.data.repayments || []);
      }
    } catch (error) {
      console.error('Failed to fetch repayments:', error);
    }
  };

  const score = creditScoreData?.score || 400;
  const tier = creditScoreData?.tier || 'D';

  const stats = [
    { label: "Credit Score", value: score.toString(), change: creditScoreData?.stats?.totalRepayments > 0 ? "+" + Math.min(creditScoreData.stats.totalRepayments, 50) : "", color: "orange" },
    { label: "Risk Tier", value: tier, change: "", color: score >= 700 ? "green" : score >= 500 ? "blue" : "red" },
    { label: "Active Loans", value: (creditScoreData?.stats?.activeLoans || loans.length || 0).toString(), change: "", color: "green" },
    { label: "On-Time Rate", value: creditScoreData?.stats?.totalRepayments > 0 
      ? Math.round((creditScoreData.stats.onTimeRepayments / creditScoreData.stats.totalRepayments) * 100) + "%" 
      : "N/A", change: "", color: "purple" }
  ];

  const activeLoans = [
    { 
      id: 1, 
      name: "Emergency Loan", 
      lender: "KCB Bank", 
      amount: 100000, 
      remaining: 65000, 
      nextPayment: "Mar 30, 2024", 
      nextAmount: 5000, 
      progress: 35,
      rate: "12%",
      due: "30th of each month"
    },
    { 
      id: 2, 
      name: "School Fees Loan", 
      lender: "Kimisitu SACCO", 
      amount: 50000, 
      remaining: 25000, 
      nextPayment: "Apr 15, 2024", 
      nextAmount: 4500, 
      progress: 50,
      rate: "10%",
      due: "15th of each month"
    }
  ];

  const recentTransactions = [
    { id: 1, date: 'Mar 15, 2024', amount: 5000, status: 'success', description: 'Loan Repayment - Emergency Loan', type: 'debit' },
    { id: 2, date: 'Mar 1, 2024', amount: 5000, status: 'success', description: 'Loan Repayment - Emergency Loan', type: 'debit' },
    { id: 3, date: 'Feb 28, 2024', amount: 4500, status: 'success', description: 'Loan Repayment - School Fees', type: 'debit' },
    { id: 4, date: 'Feb 15, 2024', amount: 4500, status: 'success', description: 'Loan Repayment - School Fees', type: 'debit' },
    { id: 5, date: 'Jan 30, 2024', amount: 5000, status: 'success', description: 'Loan Repayment - Emergency Loan', type: 'debit' }
  ];

  const creditFactors = [
    { name: "Repayment Consistency", score: 85, color: "bg-green-500" },
    { name: "History Depth", score: 72, color: "bg-blue-500" },
    { name: "Credit Utilisation", score: 68, color: "bg-yellow-500" },
    { name: "Income Stability", score: 78, color: "bg-purple-500" }
  ];

  const kycStatus = {
    tier1: { status: 'approved', date: 'Jan 5, 2024', icon: 'check' },
    tier2: { status: 'approved', date: 'Jan 10, 2024', icon: 'check' },
    tier3: { status: 'pending', date: 'Jan 15, 2024', icon: 'clock' }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'loans', label: 'My Loans' },
    { id: 'repayments', label: 'Repayments' },
    { id: 'credit', label: 'Credit Score' },
    { id: 'kyc', label: 'KYC Status' },
    { id: 'apply', label: 'Apply' }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getCreditRating = (score) => {
    if (score >= 800) return { grade: 'AAA', label: 'Exceptional', color: 'text-green-600' };
    if (score >= 700) return { grade: 'AA', label: 'Excellent', color: 'text-green-600' };
    if (score >= 600) return { grade: 'A', label: 'Good', color: 'text-blue-600' };
    if (score >= 500) return { grade: 'B', label: 'Fair', color: 'text-yellow-600' };
    if (score >= 400) return { grade: 'C', label: 'Poor', color: 'text-orange-600' };
    return { grade: 'D', label: 'Very Poor', color: 'text-red-600' };
  };

  const creditRating = getCreditRating(score);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
              <p className="text-primary-100">Your financial health is improving. Keep up the great work!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    {stat.change && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Active Loans</h2>
                  <button 
                    onClick={() => setActiveTab('loans')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                {activeLoans.map(loan => (
                  <div key={loan.id} className="border border-gray-200 rounded-lg p-4 mb-3 last:mb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{loan.name}</h3>
                        <p className="text-sm text-gray-500">{loan.lender}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="font-semibold text-gray-900">KES {loan.remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Next Payment</p>
                        <p className="font-semibold text-gray-900">{loan.nextPayment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount Due</p>
                        <p className="font-semibold text-primary-600">KES {loan.nextAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all" 
                          style={{ width: `${loan.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{loan.progress}% paid</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Transactions</h2>
                  <button 
                    onClick={() => setActiveTab('repayments')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">-KES {tx.amount.toLocaleString()}</p>
                        <span className="text-xs text-green-600 capitalize">{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Credit Score</h2>
                  <button 
                    onClick={() => setActiveTab('credit')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary-600">{score}</div>
                  <div>
                    <div className={`text-lg font-semibold ${creditRating.color}`}>
                      {tier} - {creditRating.label}
                    </div>
                    <p className="text-sm text-gray-500">
                      {creditScoreData?.stats?.totalRepayments > 0 
                        ? `${creditScoreData.stats.totalRepayments} repayments made`
                        : 'Start repaying to build score'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">KYC Status</h2>
                  <button 
                    onClick={() => setActiveTab('kyc')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </button>
                </div>
                <div className="flex gap-2">
                  {Object.entries(kycStatus).map(([tier, data]) => (
                    <div key={tier} className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        data.status === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {data.status === 'approved' ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-900 uppercase">Tier {tier.replace('tier', '')}</p>
                      <p className="text-xs text-gray-500 capitalize">{data.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'loans':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">My Loans</h2>
              <button 
                onClick={() => setActiveTab('apply')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Apply for New Loan
              </button>
            </div>

            {activeLoans.map(loan => (
              <div key={loan.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{loan.name}</h3>
                    <p className="text-gray-500">{loan.lender}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-lg font-semibold text-primary-600">{loan.rate} p.a.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Principal Amount</p>
                    <p className="text-lg font-semibold">KES {loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remaining Balance</p>
                    <p className="text-lg font-semibold text-primary-600">KES {loan.remaining.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Payment Due</p>
                    <p className="text-lg font-semibold">{loan.nextPayment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Due</p>
                    <p className="text-lg font-semibold">KES {loan.nextAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Schedule:</span> Due on the {loan.due}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Repayment Progress</span>
                      <span className="font-medium">{loan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-600 h-3 rounded-full transition-all" 
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'repayments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Repayment History</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="p-4 text-sm text-gray-900">{tx.date}</td>
                      <td className="p-4 text-sm text-gray-600">{tx.description}</td>
                      <td className="p-4 text-sm font-semibold text-gray-900">KES {tx.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Upcoming Payments</h3>
              <div className="space-y-3">
                {activeLoans.map(loan => (
                  <div key={loan.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{loan.name}</p>
                      <p className="text-sm text-gray-500">Due: {loan.nextPayment}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">KES {loan.nextAmount.toLocaleString()}</p>
                      <button className="text-xs text-primary-600 font-medium hover:underline">
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'credit':
        const breakdown = creditScoreData?.breakdown || {};
        const creditFactors = [
          { name: 'Repayment Consistency', score: breakdown.repaymentConsistency?.value || 0, color: 'bg-green-500', weight: 35 },
          { name: 'History Depth', score: breakdown.historyDepth?.value || 0, color: 'bg-blue-500', weight: 20 },
          { name: 'Credit Utilisation', score: breakdown.creditUtilization?.value || 0, color: 'bg-yellow-500', weight: 15 },
          { name: 'Income Stability', score: breakdown.incomeStability?.value || 0, color: 'bg-purple-500', weight: 15 },
          { name: 'Institution Diversity', score: breakdown.institutionDiversity?.value || 0, color: 'bg-teal-500', weight: 10 },
          { name: 'Fraud/Dispute', score: breakdown.fraudDisputeRecord?.value || 100, color: 'bg-gray-500', weight: 5 }
        ];
        
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Your Credit Score</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-8 text-white">
                <div className="text-center">
                  <p className="text-primary-200 mb-2">Dhamini Credit Score (DCS)</p>
                  <div className="text-7xl font-bold mb-2">{score}</div>
                  <div className="inline-block bg-white/20 px-4 py-1 rounded-full mb-4">
                    <span className="text-xl font-semibold">{tier}</span>
                    <span className="mx-2">-</span>
                    <span>{creditRating.label}</span>
                  </div>
                  <p className="text-primary-200 text-sm">
                    {creditScoreData?.tierDescription || 'Building your credit history'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  {creditFactors.map((factor, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">{factor.name} ({factor.weight}%)</span>
                        <span className="text-sm font-medium text-gray-900">{Math.round(factor.score)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${factor.color}`}
                          style={{ width: `${factor.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Score History</h3>
              {creditScoreData?.scoreHistory && creditScoreData.scoreHistory.length > 0 ? (
                <div className="h-48 flex items-end justify-between gap-2">
                  {creditScoreData.scoreHistory.slice(0, 7).reverse().map((entry, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary-200 rounded-t"
                        style={{ height: `${(entry.score / 1000) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(entry.date).toLocaleDateString('en', { month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No score history yet. Start repaying loans to build your history.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Estimated Credit Limit</p>
                <p className="text-lg font-semibold">KES {creditScoreData?.estimatedCreditLimit?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Repayments</p>
                <p className="text-lg font-semibold">{creditScoreData?.stats?.totalRepayments || 0}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="text-lg font-semibold">
                  {creditScoreData?.lastUpdated 
                    ? new Date(creditScoreData.lastUpdated).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
            </div>

            {creditScoreData?.improvementTips && creditScoreData.improvementTips.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Tips to Improve Your Score</h3>
                <ul className="space-y-2">
                  {creditScoreData.improvementTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-blue-800">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'kyc':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">KYC Verification Status</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Tier 3 verification in progress</p>
                  <p className="text-sm text-blue-700">Complete your full KYC to unlock higher loan limits</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  Verified
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Tier 1 - Phone Verification</h3>
                <p className="text-sm text-gray-500 mb-3">Basic phone number verification</p>
                <div className="text-sm">
                  <p className="text-gray-600">Verified on: <span className="font-medium">{kycStatus.tier1.date}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  Verified
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Tier 2 - Basic KYC</h3>
                <p className="text-sm text-gray-500 mb-3">ID verification and basic details</p>
                <div className="text-sm">
                  <p className="text-gray-600">Verified on: <span className="font-medium">{kycStatus.tier2.date}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  Pending
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Tier 3 - Full Verification</h3>
                <p className="text-sm text-gray-500 mb-3">Biometric and address verification</p>
                <button className="w-full bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition">
                  Complete Verification
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Your Benefits by KYC Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Tier 1 Verified</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Loan limit: Up to KES 10,000</li>
                    <li>Single lender only</li>
                    <li>Basic repayment tracking</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Tier 2 Verified</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Loan limit: Up to KES 50,000</li>
                    <li>Multiple lenders</li>
                    <li>Digital mandate signing</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h4 className="font-medium text-primary-900 mb-2">Tier 3 Verified (Current)</h4>
                  <ul className="text-sm text-primary-700 space-y-1">
                    <li>Loan limit: Up to KES 500,000</li>
                    <li>Any participating institution</li>
                    <li>Priority credit scoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'apply':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Apply for a Loan</h2>
            
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-sm text-primary-800">
                <strong>Pre-approved limit:</strong> Based on your credit score, you qualify for loans up to KES 150,000
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (KES)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter amount (e.g., 50000)"
                    min="1000"
                    max="150000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Min: KES 1,000 | Max: KES 150,000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Select purpose</option>
                    <option value="emergency">Emergency/Medical</option>
                    <option value="education">Education/School Fees</option>
                    <option value="business">Business Capital</option>
                    <option value="home">Home Improvement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12" selected>12 months</option>
                    <option value="24">24 months</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Loan Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium">KES 50,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">12% p.a.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-medium">KES 6,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">KES 500</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Repayment:</span>
                      <span className="font-bold text-primary-600">KES 56,500</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium">KES 4,708</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      By applying, you agree to sign a digital mandate for automatic repayments. This is a legally-binding agreement.
                    </p>
                  </div>
                </div>

                <button 
                  type="button"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Borrower Portal</h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">Borrower Account</p>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default BorrowerPortal;
