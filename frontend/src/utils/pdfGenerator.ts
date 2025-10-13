import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    school?: string;
    grade?: string;
  };
  report: {
    overallProfile: {
      primaryStyle: string;
      secondaryStyle: string;
      strengths: string[];
      recommendations: string[];
    };
    educationMapping: {
      recommendedSHS: string[];
      recommendedTertiary: string[];
      careerSuggestions: string[];
    };
    insights: {
      learningPreferences: string[];
      decisionMakingStyle: string;
      communicationStyle: string;
    };
    generatedAt: string;
  };
  assessments: Array<{
    type: string;
    scores: { [key: string]: number };
    completedAt: string;
  }>;
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  async generateReportPDF(data: ReportData): Promise<void> {
    // Set up fonts and colors
    this.setupStyles();
    
    // Add header
    this.addHeader(data.user);
    
    // Add executive summary
    this.addExecutiveSummary(data.report.overallProfile);
    
    // Add assessment results
    this.addAssessmentResults(data.assessments);
    
    // Add education recommendations
    this.addEducationRecommendations(data.report.educationMapping);
    
    // Add insights and recommendations
    this.addInsights(data.report.insights);
    
    // Add footer
    this.addFooter();
    
    // Save the PDF
    const fileName = `Thinking_Style_Report_${data.user.firstName}_${data.user.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(fileName);
  }

  private setupStyles(): void {
    // Set default font
    this.doc.setFont('helvetica');
  }

  private addHeader(user: any): void {
    // Title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(37, 99, 235); // Blue color
    this.doc.text('Thinking Style Assessment Report', this.margin, this.currentY);
    this.currentY += 15;

    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(107, 114, 128); // Gray color
    this.doc.text('Ghana Education System - Personalized Learning Recommendations', this.margin, this.currentY);
    this.currentY += 20;

    // User information box
    this.doc.setFillColor(243, 244, 246); // Light gray background
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Student Information:', this.margin + 5, this.currentY + 10);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Name: ${user.firstName} ${user.lastName}`, this.margin + 5, this.currentY + 20);
    this.doc.text(`Email: ${user.email}`, this.margin + 5, this.currentY + 30);
    
    if (user.school) {
      this.doc.text(`School: ${user.school}`, this.margin + 120, this.currentY + 20);
    }
    if (user.grade) {
      this.doc.text(`Grade: ${user.grade}`, this.margin + 120, this.currentY + 30);
    }
    
    this.currentY += 50;
  }

  private addExecutiveSummary(profile: any): void {
    this.addSectionHeader('Executive Summary');
    
    // Primary and Secondary Styles
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Your Thinking Style Profile:', this.margin, this.currentY);
    this.currentY += 10;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Primary Style: ${this.formatStyleName(profile.primaryStyle)}`, this.margin, this.currentY);
    this.currentY += 8;
    this.doc.text(`Secondary Style: ${this.formatStyleName(profile.secondaryStyle)}`, this.margin, this.currentY);
    this.currentY += 15;
    
    // Strengths
    if (profile.strengths && profile.strengths.length > 0) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Key Strengths:', this.margin, this.currentY);
      this.currentY += 8;
      
      this.doc.setFont('helvetica', 'normal');
      profile.strengths.forEach((strength: string) => {
        this.doc.text(`• ${strength}`, this.margin + 5, this.currentY);
        this.currentY += 6;
      });
      this.currentY += 5;
    }
    
    this.currentY += 10;
  }

  private addAssessmentResults(assessments: any[]): void {
    this.addSectionHeader('Assessment Results');
    
    assessments.forEach((assessment, index) => {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${this.formatAssessmentName(assessment.type)}:`, this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      
      // Add scores as a simple table
      const scores = Object.entries(assessment.scores);
      const colWidth = (this.pageWidth - 2 * this.margin) / scores.length;
      
      scores.forEach(([category, score], i) => {
        const x = this.margin + i * colWidth;
        this.doc.text(`${this.formatCategoryName(category)}: ${(score as number).toFixed(1)}`, x, this.currentY);
      });
      
      this.currentY += 15;
      
      // Add completion date
      this.doc.setFontSize(8);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`Completed: ${new Date(assessment.completedAt).toLocaleDateString('en-GH')}`, this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setTextColor(0, 0, 0);
      this.currentY += 5;
    });
  }

  private addEducationRecommendations(mapping: any): void {
    this.addSectionHeader('Ghana Education Recommendations');
    
    // SHS Tracks
    if (mapping.recommendedSHS && mapping.recommendedSHS.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Recommended SHS Tracks:', this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      mapping.recommendedSHS.forEach((track: string) => {
        this.doc.text(`• ${track}`, this.margin + 5, this.currentY);
        this.currentY += 6;
      });
      this.currentY += 10;
    }
    
    // Tertiary Programs
    if (mapping.recommendedTertiary && mapping.recommendedTertiary.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Recommended Tertiary Programs:', this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      mapping.recommendedTertiary.forEach((program: string) => {
        this.doc.text(`• ${program}`, this.margin + 5, this.currentY);
        this.currentY += 6;
      });
      this.currentY += 10;
    }
    
    // Career Suggestions
    if (mapping.careerSuggestions && mapping.careerSuggestions.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Career Suggestions:', this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      mapping.careerSuggestions.forEach((career: string) => {
        this.doc.text(`• ${career}`, this.margin + 5, this.currentY);
        this.currentY += 6;
      });
      this.currentY += 10;
    }
  }

  private addInsights(insights: any): void {
    this.addSectionHeader('Learning Insights & Recommendations');
    
    // Learning Preferences
    if (insights.learningPreferences && insights.learningPreferences.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Learning Preferences:', this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      insights.learningPreferences.forEach((preference: string) => {
        this.doc.text(`• ${preference}`, this.margin + 5, this.currentY);
        this.currentY += 6;
      });
      this.currentY += 10;
    }
    
    // Decision Making Style
    if (insights.decisionMakingStyle) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Decision Making Style:', this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.text(insights.decisionMakingStyle, this.margin, this.currentY);
      this.currentY += 15;
    }
    
    // Communication Style
    if (insights.communicationStyle) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Communication Style:', this.margin, this.currentY);
      this.currentY += 10;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.text(insights.communicationStyle, this.margin, this.currentY);
      this.currentY += 15;
    }
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 30;
    
    // Add line
    this.doc.setDrawColor(229, 231, 235);
    this.doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY);
    
    // Add footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text('Thinking Styles Assessment - Ghana Education System', this.margin, footerY + 10);
    this.doc.text(`Generated on ${new Date().toLocaleDateString('en-GH')}`, this.pageWidth - this.margin - 50, footerY + 10);
  }

  private addSectionHeader(title: string): void {
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 100) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(37, 99, 235);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;
    
    // Add underline
    this.doc.setDrawColor(37, 99, 235);
    this.doc.line(this.margin, this.currentY - 5, this.margin + 100, this.currentY - 5);
    this.currentY += 10;
  }

  private formatStyleName(style: string): string {
    return style.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private formatAssessmentName(type: string): string {
    const names: { [key: string]: string } = {
      'kolb': 'Kolb\'s Learning Cycle',
      'sternberg': 'Sternberg\'s Intelligence',
      'dual_process': 'Dual Process Theory'
    };
    return names[type] || type;
  }

  private formatCategoryName(category: string): string {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}

// Utility function to generate PDF from report data
export async function generateReportPDF(data: ReportData): Promise<void> {
  const generator = new PDFGenerator();
  await generator.generateReportPDF(data);
}

// Alternative function to generate PDF from HTML element
export async function generatePDFFromElement(element: HTMLElement, filename: string = 'report.pdf'): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
