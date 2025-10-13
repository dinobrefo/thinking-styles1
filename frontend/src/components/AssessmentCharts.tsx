import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface AssessmentData {
  type: string;
  scores: { [key: string]: number };
  completedAt: string;
}

interface AssessmentChartsProps {
  assessments: AssessmentData[];
  className?: string;
}

export const AssessmentCharts: React.FC<AssessmentChartsProps> = ({ assessments, className = '' }) => {
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(37, 99, 235, 0.8)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Radar chart options
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Generate Kolb Learning Style Chart
  const generateKolbChart = (assessment: AssessmentData) => {
    const categories = ['Concrete Experience', 'Reflective Observation', 'Abstract Conceptualization', 'Active Experimentation'];
    const scores = categories.map(cat => {
      const key = cat.toLowerCase().replace(' ', '_');
      return assessment.scores[key] || 0;
    });

    return {
      labels: categories,
      datasets: [
        {
          label: 'Kolb Learning Styles',
          data: scores,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)', // Blue
            'rgba(16, 185, 129, 0.8)', // Green
            'rgba(245, 158, 11, 0.8)', // Yellow
            'rgba(239, 68, 68, 0.8)'   // Red
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  // Generate Sternberg Intelligence Chart
  const generateSternbergChart = (assessment: AssessmentData) => {
    const categories = ['Analytical', 'Creative', 'Practical'];
    const scores = categories.map(cat => assessment.scores[cat.toLowerCase()] || 0);

    return {
      labels: categories,
      datasets: [
        {
          label: 'Sternberg Intelligence Types',
          data: scores,
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)', // Purple
            'rgba(236, 72, 153, 0.8)', // Pink
            'rgba(34, 197, 94, 0.8)'   // Green
          ],
          borderColor: [
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  // Generate Dual Process Chart
  const generateDualProcessChart = (assessment: AssessmentData) => {
    const categories = ['System 1 (Intuitive)', 'System 2 (Analytical)'];
    const scores = categories.map(cat => {
      const key = cat.includes('System 1') ? 'system_1' : 'system_2';
      return assessment.scores[key] || 0;
    });

    return {
      labels: categories,
      datasets: [
        {
          label: 'Decision Making Style',
          data: scores,
          backgroundColor: [
            'rgba(251, 146, 60, 0.8)', // Orange
            'rgba(99, 102, 241, 0.8)'  // Indigo
          ],
          borderColor: [
            'rgba(251, 146, 60, 1)',
            'rgba(99, 102, 241, 1)'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  // Generate Combined Radar Chart
  const generateCombinedRadarChart = () => {
    const allAssessments = assessments.filter(a => a.scores && Object.keys(a.scores).length > 0);
    
    if (allAssessments.length === 0) return null;

    const datasets = allAssessments.map((assessment, index) => {
      const colors = [
        'rgba(59, 130, 246, 0.6)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)'
      ];
      
      const borderColors = [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)'
      ];

      let data: number[] = [];
      let labels: string[] = [];

      if (assessment.type === 'kolb') {
        labels = ['Concrete Experience', 'Reflective Observation', 'Abstract Conceptualization', 'Active Experimentation'];
        data = labels.map(label => {
          const key = label.toLowerCase().replace(' ', '_');
          return assessment.scores[key] || 0;
        });
      } else if (assessment.type === 'sternberg') {
        labels = ['Analytical', 'Creative', 'Practical'];
        data = labels.map(label => assessment.scores[label.toLowerCase()] || 0);
      } else if (assessment.type === 'dual_process') {
        labels = ['System 1 (Intuitive)', 'System 2 (Analytical)'];
        data = [
          assessment.scores['system_1'] || 0,
          assessment.scores['system_2'] || 0
        ];
      }

      return {
        label: getAssessmentDisplayName(assessment.type),
        data,
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length],
        borderWidth: 2,
        pointBackgroundColor: borderColors[index % borderColors.length],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColors[index % borderColors.length]
      };
    });

    return {
      labels: datasets[0]?.data ? ['Analytical', 'Creative', 'Practical', 'Intuitive', 'Reflective'] : [],
      datasets
    };
  };

  // Generate Progress Chart
  const generateProgressChart = () => {
    const completedAssessments = assessments.filter(a => a.scores && Object.keys(a.scores).length > 0);
    const totalAssessments = 3;
    
    return {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          label: 'Assessment Progress',
          data: [completedAssessments.length, totalAssessments - completedAssessments.length],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)', // Green for completed
            'rgba(156, 163, 175, 0.8)' // Gray for remaining
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(156, 163, 175, 1)'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  const getAssessmentDisplayName = (type: string): string => {
    const names: { [key: string]: string } = {
      'kolb': 'Kolb\'s Learning Cycle',
      'sternberg': 'Sternberg\'s Intelligence',
      'dual_process': 'Dual Process Theory'
    };
    return names[type] || type;
  };

  const completedAssessments = assessments.filter(a => a.scores && Object.keys(a.scores).length > 0);

  if (completedAssessments.length === 0) {
    return (
      <div className={`assessment-charts ${className}`}>
        <div className="no-data-message">
          <h3>No Assessment Data Available</h3>
          <p>Complete your assessments to see visualizations of your thinking styles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`assessment-charts ${className}`}>
      <div className="charts-grid">
        {/* Progress Overview */}
        <div className="chart-container">
          <h3>Assessment Progress</h3>
          <div className="chart-wrapper">
            <Doughnut 
              data={generateProgressChart()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Individual Assessment Charts */}
        {completedAssessments.map((assessment, index) => (
          <div key={index} className="chart-container">
            <h3>{getAssessmentDisplayName(assessment.type)}</h3>
            <div className="chart-wrapper">
              {assessment.type === 'kolb' && (
                <Bar data={generateKolbChart(assessment)} options={chartOptions} />
              )}
              {assessment.type === 'sternberg' && (
                <Bar data={generateSternbergChart(assessment)} options={chartOptions} />
              )}
              {assessment.type === 'dual_process' && (
                <Bar data={generateDualProcessChart(assessment)} options={chartOptions} />
              )}
            </div>
          </div>
        ))}

        {/* Combined Radar Chart */}
        {completedAssessments.length > 1 && (
          <div className="chart-container full-width">
            <h3>Overall Thinking Style Profile</h3>
            <div className="chart-wrapper">
              <Radar 
                data={generateCombinedRadarChart() || { labels: [], datasets: [] }} 
                options={radarOptions} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentCharts;
