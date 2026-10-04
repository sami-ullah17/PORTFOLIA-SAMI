import { jsPDF } from 'jspdf';
import { PortfolioData } from '../types/portfolio';

export function generateResumePdf(data: PortfolioData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Colors & Styling
  const primaryColor: [number, number, number] = [24, 24, 27]; // Zinc-900
  const secondaryColor: [number, number, number] = [82, 82, 91]; // Zinc-600
  const accentColor: [number, number, number] = [13, 148, 136]; // Teal-600

  // 1. Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text(data.personal.name.toUpperCase(), margin, y);
  y += 6;

  // 2. Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...accentColor);
  doc.text(data.personal.roleTitle, margin, y);
  y += 5.5;

  // 3. Contact Line
  doc.setFontSize(8.5);
  doc.setTextColor(...secondaryColor);
  const contactParts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    'GitHub: ' + data.personal.github.replace('https://', ''),
  ].filter(Boolean);

  const contactLine = contactParts.join('  |  ');
  const splitContact = doc.splitTextToSize(contactLine, contentWidth);
  doc.text(splitContact, margin, y);
  y += splitContact.length * 4 + 2;

  // Horizontal divider line
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Helper function for section headings
  const renderSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 26, y);
    y += 4;
  };

  // 4. Professional Summary
  if (data.aboutText) {
    renderSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(...secondaryColor);
    const summaryLines = doc.splitTextToSize(data.aboutText, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4.2 + 4;
  }

  // 5. Education
  if (data.education && data.education.length > 0) {
    renderSectionHeader('Education');
    data.education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...primaryColor);
      doc.text(edu.degree, margin, y);

      // Period right aligned
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...secondaryColor);
      doc.text(edu.period, pageWidth - margin, y, { align: 'right' });
      y += 4.2;

      // Institution & GPA
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(60, 60, 60);
      const instLine = `${edu.institution}  —  GPA: ${edu.gpa}`;
      doc.text(instLine, margin, y);
      y += 4;

      if (edu.coursework && edu.coursework.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.2);
        doc.setTextColor(...secondaryColor);
        const courseText = `Key Coursework: ${edu.coursework.join(', ')}`;
        const courseLines = doc.splitTextToSize(courseText, contentWidth);
        doc.text(courseLines, margin, y);
        y += courseLines.length * 3.8 + 2;
      }
      y += 2;
    });
    y += 2;
  }

  // 6. Technical Skills & Learning
  if (data.skills && data.skills.length > 0) {
    renderSectionHeader('Technical Skills & Competencies');
    
    // Group skills by category
    const skillsByCategory: Record<string, string[]> = {};
    data.skills.forEach((s) => {
      const cat = s.category || 'Core Skills';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(`${s.name} (${s.level})`);
    });

    Object.entries(skillsByCategory).forEach(([cat, list]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(...primaryColor);
      doc.text(`${cat}: `, margin, y);

      const catWidth = doc.getTextWidth(`${cat}: `);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      const listText = list.join(', ');
      const listLines = doc.splitTextToSize(listText, contentWidth - catWidth);
      doc.text(listLines, margin + catWidth, y);
      y += listLines.length * 4 + 1.2;
    });

    if (data.pythonLearningNote) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...accentColor);
      doc.text('Hands-on Practice: ', margin, y);
      const noteW = doc.getTextWidth('Hands-on Practice: ');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      const noteLines = doc.splitTextToSize(data.pythonLearningNote, contentWidth - noteW);
      doc.text(noteLines, margin + noteW, y);
      y += noteLines.length * 3.8 + 3;
    }
    y += 3;
  }

  // 7. Work Experience
  if (data.experience && data.experience.length > 0) {
    renderSectionHeader('Practical Experience');
    data.experience.forEach((exp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...primaryColor);
      doc.text(exp.role, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...secondaryColor);
      doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
      y += 4.2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(60, 60, 60);
      const orgLine = exp.location ? `${exp.organization} — ${exp.location}` : exp.organization;
      doc.text(orgLine, margin, y);
      y += 4;

      exp.highlights.forEach((h) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...secondaryColor);
        doc.text('•', margin + 2, y);
        const bulletLines = doc.splitTextToSize(h, contentWidth - 6);
        doc.text(bulletLines, margin + 6, y);
        y += bulletLines.length * 3.8 + 1;
      });
      y += 2;
    });
    y += 2;
  }

  // 8. Projects
  if (data.projects && data.projects.length > 0 && y < pageHeight - 35) {
    renderSectionHeader('Projects');
    data.projects.forEach((proj) => {
      if (y > pageHeight - 20) return; // keep clean single-page constraint

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(...primaryColor);
      doc.text(proj.title, margin, y);

      if (proj.tags && proj.tags.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...accentColor);
        const tagsStr = `[${proj.tags.join(', ')}]`;
        doc.text(tagsStr, margin + doc.getTextWidth(proj.title) + 3, y);
      }
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...secondaryColor);
      const descLines = doc.splitTextToSize(proj.description, contentWidth);
      doc.text(descLines, margin, y);
      y += descLines.length * 3.8 + 1.5;

      if (proj.githubUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(37, 99, 235); // Blue link
        doc.text(`Repository: ${proj.githubUrl}`, margin, y);
        y += 4;
      }
      y += 2;
    });
  }

  return doc;
}

export function downloadResume(data: PortfolioData): void {
  // If user uploaded a custom PDF in admin mode, download that directly
  if (data.customResumePdf) {
    const link = document.createElement('a');
    link.href = data.customResumePdf;
    link.download = data.customResumeName || `${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Otherwise generate crisp modern vector PDF
  const doc = generateResumePdf(data);
  doc.save(`${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`);
}
