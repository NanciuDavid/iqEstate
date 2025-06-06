import React from "react";
import { FileText, Map, BarChart, Zap } from "lucide-react";

const HowItWorks = () => {
    const steps = [
        {
            icon: <FileText className="w-10 h-10 text-amber-600" />,
            title: "Fill in Property Details",
            description:
                "Provide insightful details about the property such as size, number of rooms, location, and other relevant information.",
        },
        {
            icon: <Map className="h-10 w-10 text-amber-600" />,
            title: "Analyze Location factors",
            description:
                "Our system automatically analyzes nearby amenities, schools, transportation stations, and other factors that influence property value.",
        },
        {
            icon: <BarChart className="h-10 w-10 text-amber-600" />,
            title: "Process Market Data",
            description:
                "We incorporate current market trends, historical data, and macroeconomic indicators into our prediction model in order to provide a comprehensive valuation.",
        },
        {
            icon: <Zap className="h-10 w-10 text-amber-600" />,
            title: "Get Accurate Prediction",
            description:
                "Receive a detailed price prediction with analysis of factors influencing the property's value.",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className="relative flex flex-col items-center text-center"
                >
                    {/* Connection line */}
                    {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-300 z-0">
                            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-600"></div>
                        </div>
                    )}

                    {/* Step icon */}
                    <div className="bg-amber-100 rounded-full p-5 mb-5 relative z-10 shadow-md">
                        {step.icon}
                    </div>

                    {/* Step number badge */}
                    <div className="absolute top-0 right-0 lg:right-auto lg:left-1/2 lg:top-0 transform translate-x-1/2 -translate-y-1/3 lg:translate-x-8 bg-slate-700 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow">
                        {index + 1}
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 mb-3">
                        {step.title}
                    </h3>
                    <p className="text-slate-600">{step.description}</p>
                </div>
            ))}
        </div>
    );
};

export default HowItWorks;
