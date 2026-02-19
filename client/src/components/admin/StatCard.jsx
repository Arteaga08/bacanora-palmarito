import React from "react";

const StatCard = ({ title, value, icon, trend, isDanger }) => {
  return (
    <div className="bg-brand-cream border border-brand-dark/10 p-8 flex flex-col justify-between group hover:border-brand-clay/30 transition-colors duration-500">
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-dark/50 font-medium">
          {title}
        </span>
        <div
          className={`${isDanger ? "text-rose-600" : "text-brand-clay"} opacity-80 group-hover:opacity-100 transition-opacity`}
        >
          {icon}
        </div>
      </div>

      <div>
        <h3
          className={`text-4xl font-serif tracking-tighter ${isDanger ? "text-rose-600" : "text-brand-dark"}`}
        >
          {value}
        </h3>
        {trend && (
          <p className="text-[9px] uppercase tracking-[0.2em] text-brand-dark/40 mt-2">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
