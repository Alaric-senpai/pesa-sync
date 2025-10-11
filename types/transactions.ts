type transactionType = 'sent' | 'received' | 'lend' | 'borrow' | 'repayment';

export interface Transaction {
  id: string;
  type: transactionType;
  amount: number;
  date: string;
  balanceAfter: number;
  sender: string;
  senderName?: string;
  reference?: string;
}

export interface TransactionSummary {
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
  lastTransactionDate?: string; 
}



export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: 500,
    date: '2023-10-01T10:00:00Z',
    balanceAfter: 1500,
    sender: 'John Doe',
    reference: 'Payment for groceries'
  },
  {
    id: '2',
    type: 'received',
    amount: 2000,
    date: '2023-10-02T12:30:00Z',
    balanceAfter: 3500,
    sender: 'Jane Smith',
    reference: 'Salary for September'
  },
  {
    id: '3',
    type: 'sent',
    amount: 300,
    date: '2023-10-03T15:45:00Z',
    balanceAfter: 3200,
    sender: 'Alice Johnson',
    reference: 'Dinner with friends'
  },
  {
    id: '4',
    type: 'received',
    amount: 150,
    date: '2023-10-04T09:20:00Z',
    balanceAfter: 3350,
    sender: 'Bob Brown',
    reference: 'Refund for returned item'
  },
  {
    id: '5',
    type: 'sent',
    amount: 1000,
    date: '2023-10-05T18:00:00Z',
    balanceAfter: 2350,
    sender: 'Charlie Davis',
    reference: 'Rent for October'
  } 
];

export const getTransactionSummary = (transactions: Transaction[]): TransactionSummary => {
  let totalSent = 0;
  let totalReceived = 0;
  let lastTransactionDate: string | undefined;

  transactions.forEach(tx => {
    if (tx.type === 'sent') {
      totalSent += tx.amount;
    } else if (tx.type === 'received') {
      totalReceived += tx.amount;
    }

    if (!lastTransactionDate || new Date(tx.date) > new Date(lastTransactionDate)) {
      lastTransactionDate = tx.date;
    }
  });

  return {
    totalSent,
    totalReceived,
    transactionCount: transactions.length,
    lastTransactionDate
  };
};