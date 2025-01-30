
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart } from '../../components/pieChart/PieChart'
import { VertBarChart } from '../../Components/vertBarChart/VertBarChart'
import { Link } from "react-router-dom";
import AuthStatus from "../../components/auth/authStatus/AuthStatus";

const Profile = () => {
  const [userId, setUserId] = useState(1)
  const [username, setUsername] = useState("")
  const [budgetName, setBudgetName] = useState("")
  const [monthlyExpenses, setMonthlyExpenses] = useState([])
  const [expenseTags, setExpenseTags] = useState([])
  const [yearlyIncome, setYearlyIncome] = useState([])
  const [yearlyExpenses, setYearlyExpenses] = useState([])

  const findUsername = async () => {
    try {
      const data = await axios.get("/users.json");
      setUsername(data.data.find((obj) => obj.id === userId).username);
    } catch (e) {
      console.error(e);
    }
  };

  const findBudgetName = async () => {
    try {
      const data = await axios.get("/budgets.json");
      setBudgetName(data.data.find((obj) => obj.user_id === userId).name);
    } catch (e) {
      console.error(e);
    }
  };

  const findMonthlyExpenses = async () => {
    try {
      const recurringData = await axios.get('/recurringTransactions.json')
      const transactionData = await axios.get('/transactions.json')
      const tagsData = await axios.get('./tags.json')

      let date = new Date().toISOString()
      let yearMonth = date.slice(0, 7)

      let recurringArr = recurringData.data.filter(obj => obj.user_id === userId && obj.isIncome === false && obj.created_date.startsWith(yearMonth))
      let transactionArr = transactionData.data.filter(obj => obj.user_id === userId && obj.isIncome === false && obj.created_date.startsWith(yearMonth))
      let recurringExpense = recurringArr.map(item => item.amount)
      let transactionExpense = transactionArr.map(item => item.amount)
      let expenses = [...recurringExpense, ...transactionExpense]
      setMonthlyExpenses(expenses)

      let recurringTags = recurringArr.map(item => tagsData.data.find(tag => tag.id === item.tag).name)
      let transactionTags = transactionArr.map(item => tagsData.data.find(tag => tag.id === item.tag).name)
      let tags = [...recurringTags, ...transactionTags]
      setExpenseTags(tags)
    } catch (e) {
      console.error(e)
    }
  }

  const findYearlyData = async () => {
    try {
      const recurringData = await axios.get('/recurringTransactions.json')
      const transactionData = await axios.get('/transactions.json')

      let date = new Date()
      let year = date.getFullYear().toString()

      let yearRecurringIncome = recurringData.data.filter(obj => obj.user_id === userId && obj.isIncome === true && obj.created_date.startsWith(year))
      let yearTransactionIncome = transactionData.data.filter(obj => obj.user_id === userId && obj.isIncome === true && obj.created_date.startsWith(year))

      let yearRecurringExpenses = recurringData.data.filter(obj => obj.user_id === userId && obj.isIncome === false && obj.created_date.startsWith(year))
      let yearTransactionExpenses = transactionData.data.filter(obj => obj.user_id === userId && obj.isIncome === false && obj.created_date.startsWith(year))

      let yearIncome = []
      let yearExpenses = []

      for (let month = 1; month <= 12; month++) {
        let monthYear
        if (month < 10) {
          monthYear = year + "-0" + month.toString()
        } else {
          monthYear = year + "-" + month.toString()
        }

        let recurringMonthIncome = yearRecurringIncome.filter(obj => obj.created_date.startsWith(monthYear))
        let transactionMonthIncome = yearTransactionIncome.filter(obj => obj.created_date.startsWith(monthYear))

        let recurringMonthExpenses = yearRecurringExpenses.filter(obj => obj.created_date.startsWith(monthYear))
        let transactionMonthExpenses = yearTransactionExpenses.filter(obj => obj.created_date.startsWith(monthYear))

        let totalMonthIncome = 0
        let totalMonthExpenses = 0

        recurringMonthIncome.forEach(obj => {
          totalMonthIncome += obj.amount
        })

        recurringMonthExpenses.forEach(obj => {
          totalMonthExpenses += obj.amount
        })

        transactionMonthIncome.forEach(obj => {
          totalMonthIncome += obj.amount
        })

        transactionMonthExpenses.forEach(obj => {
          totalMonthExpenses += obj.amount
        })

        yearIncome[month - 1] = totalMonthIncome
        yearExpenses[month - 1] = totalMonthExpenses
      }

      setYearlyIncome(yearIncome)
      setYearlyExpenses(yearExpenses)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    findUsername()
    findBudgetName()
    findMonthlyExpenses()
    findYearlyData()
  }, [])

  return (
    <>
      <h1 className='text-6xl'>Profile: {username}</h1>
      <p>{budgetName}</p>
      <div> <Link to="/transaction/add">
                <button className="rounded-full px-4 py-2 bg-blue-500 text-white">Add Transaction</button>
              </Link></div>
      <div class="flex space-x-24">
        <PieChart budgetName={budgetName} monthlyExpenses={monthlyExpenses} expenseTags={expenseTags} />
        <VertBarChart yearlyIncome={yearlyIncome} yearlyExpenses={yearlyExpenses} />
      </div>
    </>
  )
}


export default Profile;
