import React, { useEffect } from 'react';
import { ChevronRight, Database, Code, LineChart, BarChart, Cpu, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ideaLogo from '../assets/memoji/idea.png';

const AboutPage = () => {
    useEffect(() => window.scrollTo(0, 0), []);
    const technologies = [
        { name: "Java", description: "Core application and web scraping with Selenium", icon: <Code className="w-6 h-6 text-blue-800" /> },
        { name: "React + Vite", description: "Frontend development with modern tooling", icon: <ArrowUpRight className="w-6 h-6 text-blue-600" /> },
        { name: "Node.js & Express", description: "Backend API and server implementation", icon: <Code className="w-6 h-6 text-green-700" /> },
        { name: "Tailwind CSS", description: "Utility-first CSS framework for styling", icon: <ArrowUpRight className="w-6 h-6 text-teal-500" /> },
        { name: "PostgreSQL", description: "Relational database for persistent storage", icon: <Database className="w-6 h-6 text-indigo-700" /> },
        { name: "Python", description: "Machine learning model development and training", icon: <Cpu className="w-6 h-6 text-yellow-600" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-blue-900 transition-colors">
                    Home
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-gray-800 font-medium">About Us</span>
            </div>

            {/* Hero Section */}
            <div className="mb-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Revolutionizing Real Estate with AI
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        EstateIQ combines advanced Machine Learning with comprehensive
                        property data to provide the most accurate predictions and
                        insights in the real estate market.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row mt-10 gap-12">
                    <div className="w-full lg:w-1/2 rounded-xl overflow-hidden flex justify-center">
                        <img
                            src={ideaLogo}
                            alt="EstateIQ concept visualization"
                            className="w-full h-auto object-cover rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Bachelor Thesis Project
                        </h2>
                        <div className="flex items-center mb-4">
                            <div className="h-1 w-16 bg-blue-600 rounded mr-4"></div>
                            <span className="text-blue-600 font-semibold">Class of 2025</span>
                        </div>
                        <p className="text-gray-700 mb-6">
                            This project represents a bachelor thesis for the <span className="font-semibold">Cybernetics, Statistics and Informatics Economics</span> programme, 
                            focused on applying artificial intelligence to revolutionize real estate valuation.
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
                        <p className="text-gray-700 mb-4">
                            Using a custom web scraper built with Java Selenium, we've aggregated a comprehensive 
                            dataset of property listings. This data is processed through sophisticated machine learning 
                            models to generate accurate property valuations and market insights.
                        </p>
                        <p className="text-gray-700">
                            Our interdisciplinary approach combines economic theory, data science, and software 
                            engineering to create a practical solution for the real estate industry.
                        </p>
                    </div>
                </div>
            </div>

            {/* Technologies Section */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our platform leverages modern technologies to deliver fast, reliable, and intelligent real estate analytics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {technologies.map((tech, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-4">
                                {tech.icon}
                                <h3 className="text-xl font-bold text-gray-900 ml-3">{tech.name}</h3>
                            </div>
                            <p className="text-gray-600">{tech.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vision Section */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Vision</h2>
                    <div className="flex items-center justify-center mb-8">
                        <div className="h-1 w-24 bg-blue-600 rounded"></div>
                    </div>
                    <p className="text-lg text-gray-700 mb-6">
                        We envision a future where real estate transactions are guided by precise, 
                        data-driven insights rather than speculation and emotion.
                    </p>
                    <p className="text-lg text-gray-700">
                        By continuously improving our prediction models and expanding our property database, 
                        we aim to become the most trusted source of real estate valuations and market intelligence 
                        worldwide, setting new standards for the industry and academic research alike.
                    </p>
                </div>
            </div>

            {/* Data Collection */}
            <div className="mb-16">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Data-Driven Insights
                        </h2>
                        <div className="flex items-center mb-4">
                            <div className="h-1 w-16 bg-blue-600 rounded mr-4"></div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Our custom web scraper built with Java Selenium systematically collects comprehensive 
                            property data from across the market. This data is structured, cleaned, and stored in our 
                            PostgreSQL database.
                        </p>
                        <p className="text-gray-700">
                            Using Python's robust data science ecosystem, we apply statistical analysis and machine learning 
                            algorithms to extract meaningful patterns and generate accurate property valuations that account 
                            for numerous variables affecting real estate prices.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="flex items-center justify-center w-full h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                            <div className="flex items-center">
                                <LineChart className="w-12 h-12 text-blue-800 mr-4" />
                                <BarChart className="w-12 h-12 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;