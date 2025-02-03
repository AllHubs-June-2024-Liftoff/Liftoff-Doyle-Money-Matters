import React from 'react';

const About = () => {
    return (

        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">About</h2>
                <p>Money Matters is a budget tracking application designed to help users manage their finances more effectively. We developed this project because we recognized that many people, including ourselves, struggle with tracking expenses, setting financial goals, and maintaining a budget. By creating a user-friendly web application, we aimed to provide an accessible tool that simplifies financial planning. Our application allows users to input income and expenses, categorize spending, and visualize their financial habits through interactive charts and graphs. This makes it easier to identify where money is going and make informed decisions to improve financial stability. Ultimately, we built this project to promote better money management and financial awareness for users.</p>
            </div>

            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Meet the Team</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12">
                <div className="text-center">
                    <img className="rounded-xl sm:size-48 lg:size-60 mx-auto" src="./public/propic.png" alt="Avatar" />
                    <div className="mt-2 sm:mt-4">
                        <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200">
                            Person 1
                        </h3>
                        <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400">
                            Full-stack Developer
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <img className="rounded-xl sm:size-48 lg:size-60 mx-auto" src="./public/propic.png" alt="Avatar" />
                    <div className="mt-2 sm:mt-4">
                        <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200">
                            Person 2
                        </h3>
                        <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400">
                            Full-stack Developer
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <img className="rounded-xl sm:size-48 lg:size-60 mx-auto" src="./public/propic.png" alt="Avatar" />
                    <div className="mt-2 sm:mt-4">
                        <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200">
                            Person 3
                        </h3>
                        <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400">
                            Full-stack Developer
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <img className="rounded-xl sm:size-48 lg:size-60 mx-auto" src="./public/propic.png" alt="Avatar" />
                    <div className="mt-2 sm:mt-4">
                        <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200">
                            Person 4
                        </h3>
                        <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400">
                            Full-stack Developer
                        </p>
                    </div>
                </div>

            </div>

        </div>

        


    )
}

export default About;
