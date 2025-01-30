import { split } from 'postcss/lib/list';
import React, {useState} from 'react';
import api from '../../services/api';
import {useNavigate, Link} from "react-router-dom";

function Transaction() {
    const [budget, setBudget] = useState('');
    const [amount, setAmount] = useState('');
    const [splitAmount, setSplitAmount] = useState('')
    const [description, setDescription] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [isIncome, setIsIncome] = useState(false);
    const [recurringDate, setRecurring] = useState('');
    const [tag, setTag] = useState('')
    const [splits, setSplits] = useState([]);   // Array to hold splits with tag and amount
    const [isSplits, setIsSplits] = useState(false);    // State for split Tags checkbox
 
    const navigate = useNavigate();

    const {transService} = api;

    const handleAddSplit = () => {
        if(splitAmount && tag)   {
            const newSplit = {amount: parseFloat(splitAmount), tag};
            setSplits([...splits, newSplit]);   
            setSplitAmount('');
            setTag('');
        } else {
            alert('Please enter both split amount and tag for the split');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transaction = {budget, amount, description, isRecurring, isIncome, recurringDate, tag, splits, isSplits}
        console.log("Attempting to save transaction");

        try {
            const response = await transService.add(transaction);
            console.log("Transaction saved:", response);
        } catch (error) {
            console.log("Transaction error:", error);
            console.log(transaction);
        }
        navigate('/transaction/add');
    }

    return (
        <>
        
        <div className='flex justify-center items-center min-h-screen bg-black'>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
                <h1 className='text-2xl font-semibold text-center mb-6 text-black'>New Transaction</h1>
      
                    <form onSubmit= {handleSubmit}>
                        <div className='block text-black'>

                            <label className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block'>Budget <input type= 'text' value={budget} onChange={(e) => setBudget(e.target.value)} className='mt-2 p-2 w-full border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue'></input></label>
           
                            <label    className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block'>Amount
                                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}className='mt-2 p-2 w-full border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue' ></input>
                             </label>
                               
                             <label    className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' >Select if transaction is income: 
                                <input type="checkbox" checked={isIncome} onChange={(e) => setIsIncome(e.target.checked)}className='mt-2 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' ></input>
                            </label>

                            <label    className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block' >Select if transaction needs Split Tags: 
                                <input type="checkbox" checked={isSplits} onChange={() =>setIsSplits(!isSplits)}className='mt-2 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' ></input>      
                            </label>
                                {isSplits && (     
                                    <label    className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block'>Amount (Split)
                                        <input type="text" value={splitAmount} onChange={(e) => setSplitAmount(e.target.value)}className='mt-2 p-2 w-full border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue' ></input>
                                        <label className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' >Tag (Split)
                                        <input type="text" value={tag} onChange={(e) => setTag(e.target.value)}className='mt-2 p-2 w-full border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue' ></input>
                                        </label>
                                        <button  className='w-full py-2 bg-lightblue text-white rounded-md hover:bg-green 
                                                 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue' type="button" onClick={handleAddSplit} > Add Split </button>
                                    </label>
                                )}   

                            <label className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block' >Select if transaction is recurring: 
                                <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)}className='mt-2 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' ></input>
                            </label>
          
                            {isRecurring &&  (
                                <label    className='mt-2 p-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' > Recurring Day's Date (1-31) 
                                    <input type="text" value={recurringDate} onChange={(e) => setRecurring(e.target.value)}className='mt-2 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue bg-white' ></input>
                                </label>    
                            )}                           
                                                    
                            <label    className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' >Description 
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}className='mt-2 p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block' ></input>
                            </label>

                            <label    className='mt-2 p-2 w-full border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue block'>Tag
                                <input type="text" value={tag} onChange={(e) => setTag(e.target.value)}className='mt-2 p-2 w-full border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue' ></input>
                            </label>


                            <button  className='w-full py-2 bg-lightblue text-white rounded-md hover:bg-green 
                            hover:text-black focus:outline-none focus:ring-2 focus:ring-blue'>
                                Submit
                            </button>

                            <Link to='/profile'>
                                <button  className="rounded-full px-4 py-2 bg-blue-500 text-white">Cancel</button>
                            </Link>
           
                        </div>
                    </form>
                </div>
            </div>
        </>
      
    )
}

export default Transaction;

