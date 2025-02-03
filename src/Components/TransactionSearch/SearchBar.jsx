import React, {useState} from 'react';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

function SearchBar({ setTransactions, budget_id}) {

    const navigate= useNavigate();

    console.log("Received budget ID:", budget_id);

    const [query, setQuery] = useState('');
     const {transService} = api;

     const handleSearch = async (e) => {
        e.preventDefault();

        if(query) {
            try {
                const results = await transService.search(query, budget_id);
                setTransactions(results);
            } catch (error) {
                console.error('Could not fetch results', error);
            } 
        } else {
            try{
                console.log('Fetching all transactions', budget_id);
                const results = await transService.getAll(budget_id); 
                const transactionsTag = await Promise.all(results.map( async (transaction) => {
                    if (transaction.tag_id) {
                        const tagData = await transService.getTag(transaction.tag_id);
                        return { ...transaction, tag: tagData};
                    } else {
                        return {...transaction, tag: null};
                    }
                }))


                setTransactions(transactionsTag);
            } catch (error) {
                console.error("Could not fetch all transactions", error);
            }
        }

    };

    return (

        <form onSubmit={handleSearch}>
           
            <div class="flex space-x-4">
            <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
            <button onClick={(e) => navigate('/profile')} class="pd-4">Cancel</button>
            </div>
        </form>
    )


}
export default SearchBar;