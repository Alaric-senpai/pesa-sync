type ParsedMpesaMessage = {
  transactionCode: string
  type: "SendMoney" | "BuyGoods" | "PayBill" | "Withdraw" | "Deposit" | "Reversal" | "Unknown"
  amount: number
  currency: string
  recipientName?: string
  recipientPhone?: string
  merchantName?: string
  accountNumber?: string
  agentName?: string
  agentCode?: string
  balance?: number
  cost?: number
  date?: string
  time?: string
}

export function parseMpesaMessage(message: string): ParsedMpesaMessage {
  const clean = message.replace(/\s+/g, " ").trim()

  // Common parts
  const transactionCode = clean.match(/^([A-Z0-9]+) Confirmed/)?.[1] || ""

  const amountMatch = clean.match(/Ksh([\d,]+\.\d{2})/)
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 0

  const balanceMatch = clean.match(/New M-PESA balance is Ksh([\d,]+\.\d{2})/)
  const balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, "")) : undefined

  const costMatch = clean.match(/Transaction cost, Ksh([\d,]+\.\d{2})/)
  const cost = costMatch ? parseFloat(costMatch[1].replace(/,/g, "")) : undefined

  const dateTimeMatch = clean.match(/on (\d{1,2}\/\d{1,2}\/\d{2}) at ([\d:]+\s?(?:AM|PM))/i)
  const date = dateTimeMatch?.[1]
  const time = dateTimeMatch?.[2]

  // Detect transaction type
  let type: ParsedMpesaMessage["type"] = "Unknown"
  let recipientName, recipientPhone, merchantName, accountNumber, agentName, agentCode

  if (/sent to/i.test(clean)) {
    type = "SendMoney"
    recipientName = clean.match(/sent to ([A-Z\s]+) \d{10}/i)?.[1]?.trim()
    recipientPhone = clean.match(/sent to [A-Z\s]+ (\d{10})/i)?.[1]
  } else if (/paid to .* on/i.test(clean) && !/for account/i.test(clean)) {
    type = "BuyGoods"
    merchantName = clean.match(/paid to (.*?) on/i)?.[1]?.trim()
  } else if (/paid to .* for account/i.test(clean)) {
    type = "PayBill"
    merchantName = clean.match(/paid to (.*?) for/i)?.[1]?.trim()
    accountNumber = clean.match(/for account (\d+)/i)?.[1]
  } else if (/withdrawn from agent/i.test(clean)) {
    type = "Withdraw"
    agentCode = clean.match(/agent (\d+)/i)?.[1]
    agentName = clean.match(/agent \d+ (.*?) on/i)?.[1]?.trim()
  } else if (/deposited to your M-PESA/i.test(clean)) {
    type = "Deposit"
  } else if (/Reversed/i.test(clean)) {
    type = "Reversal"
  }

  return {
    transactionCode,
    type,
    amount,
    currency: "KES",
    recipientName,
    recipientPhone,
    merchantName,
    accountNumber,
    agentName,
    agentCode,
    balance,
    cost,
    date,
    time,
  }
}
