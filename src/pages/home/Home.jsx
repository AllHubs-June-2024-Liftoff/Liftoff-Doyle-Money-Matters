import React from 'react'
import { Link } from 'react-router-dom'

import './Home.css'

import moneyImage from '../../assets/money-gold-coin-growth-concept-illustration-stacks-of-gold-coin-like-income-graph-with-dollar-free-vector.jpg'

const Home = () => {
  return (
    <div>
      <article className="h-screen overflow-y-scroll snap-y snap-mandatory">
        <section className="min-h-full snap-start flex items-center justify-center">
          <div className="flex-1 text-center">
            <article>
              <img src={moneyImage} alt="Money" className="mx-auto" />
            </article>
          </div>
          <div className="flex-1 text-center">
            <article>
              <h1>Manage Your Budget</h1>
              <br />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sapiente autem, fugiat quidem cupiditate maiores ullam praesentium nisi architecto harum, velit corporis quibusdam aut veritatis saepe inventore amet, quia iusto! Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eum pariatur aut nostrum ex, eligendi magnam provident, reprehenderit dolores impedit voluptas earum odio, magni amet deserunt corporis. Nihil, modi facere.</p>
            </article>
          </div>
        </section>
        <section className="min-h-full snap-start flex items-center justify-center">
          <div className="flex-1 text-center">
            <article>
              <h1>Track Your Expenses</h1>
              <br />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sapiente autem, fugiat quidem cupiditate maiores ullam praesentium nisi architecto harum, velit corporis quibusdam aut veritatis saepe inventore amet, quia iusto! Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eum pariatur aut nostrum ex, eligendi magnam provident, reprehenderit dolores impedit voluptas earum odio, magni amet deserunt corporis. Nihil, modi facere.</p>
            </article>
          </div>
          <div className="flex-1 text-center">
            <article>
              <img src={moneyImage} alt="Money" className="mx-auto" />
            </article>
          </div>
        </section>
        <section className="min-h-full snap-start flex items-center justify-center">
          <div className="flex-1 text-center">
            <article>
              <img src={moneyImage} alt="Money" className="mx-auto" />
            </article>
          </div>
          <div className="flex-1 text-center">
            <article>
              <h1>Get Started</h1>
              <br />
              <Link to="/login">
                <button className="rounded-full px-4 py-2 bg-blue-500 text-white">Login</button>
              </Link>
              <br />
              <br />
              <Link to="/register">
                <button className="rounded-full px-4 py-2 bg-blue-500 text-white">Register</button>
              </Link>
                
            </article>
          </div>
        </section>
      </article>

    </div>
  )
}

export default Home