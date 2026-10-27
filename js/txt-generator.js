/**
 * WelcomePlace - TXT Metrics Report Generator & Downloader
 * Generates formatted text reports and initiates direct browser file downloads without servers.
 */

const TxtReportGenerator = {
  /**
   * Formats a complete, readable text report for a student's quiz attempt
   */
  generateReportText(data) {
    const divider = '='.repeat(80);
    const subDivider = '-'.repeat(80);

    const dateStr = new Date(data.timestamp || Date.now()).toLocaleString('en-CA', {
      timeZoneName: 'short'
    });

    const durationMin = Math.floor((data.durationSeconds || 0) / 60);
    const durationSec = (data.durationSeconds || 0) % 60;
    const durationFormatted = `${durationMin} mins ${durationSec < 10 ? '0' : ''}${durationSec} secs`;

    let lines = [];
    lines.push(divider);
    lines.push('                    WELCOMEPLACE CANADA - STUDENT METRICS REPORT');
    lines.push('                 Basic Computer Literacy Program for Immigrants');
    lines.push(divider);
    lines.push(`Student Name       : ${data.studentName || 'Anonymous Student'}`);
    lines.push(`Module Completed   : ${data.moduleTitle} [${data.moduleId || 'MOD'}]`);
    lines.push(`Completion Date    : ${dateStr}`);
    lines.push(`Time Spent         : ${durationFormatted}`);
    lines.push(`Overall Score      : ${data.scorePercent}% (${data.correctCount} / ${data.totalQuestions} questions correct)`);
    lines.push(`Result Status      : ${data.status || (data.scorePercent >= 70 ? 'PASSED' : 'NEEDS REVIEW')}`);
    lines.push(divider);
    lines.push('DETAILED QUESTION & ANSWER BREAKDOWN:');
    lines.push(subDivider);

    if (Array.isArray(data.details)) {
      data.details.forEach((item, index) => {
        const qNum = `[Q${index + 1}] (${item.type === 'checkbox' ? 'Multiple Choice' : 'Single Choice'})`;
        lines.push(`${qNum} ${item.prompt}`);
        
        let formattedAnswer = item.userAnswer;
        if (Array.isArray(formattedAnswer)) {
          formattedAnswer = formattedAnswer.length > 0 ? formattedAnswer.join(', ') : '[No answer selected]';
        } else if (!formattedAnswer) {
          formattedAnswer = '[No answer selected]';
        }

        const mark = item.isCorrect ? 'CORRECT [✓]' : 'INCORRECT [✗]';
        lines.push(`     Learner Answer : ${formattedAnswer} --> ${mark}`);
        if (item.explanation) {
          lines.push(`     Note/Solution  : ${item.explanation}`);
        }
        lines.push('');
      });
    }

    lines.push(subDivider);
    lines.push('PEDAGOGICAL & INSTRUCTOR OBSERVATIONS:');
    if (data.scorePercent >= 80) {
      lines.push('- Strong comprehension. Ready to advance to the next technical topic.');
    } else {
      lines.push('- Additional guided practice recommended for missed concepts.');
    }
    lines.push(divider);
    lines.push('Generated automatically by WelcomePlace Learning Platform (Offline Front-end Mode).');
    lines.push('File format: Plain Text (UTF-8) for Canadian Literacy Records.');
    lines.push(divider);

    return lines.join('\r\n');
  },

  /**
   * Generates a safe, standardized file name
   */
  generateFileName(studentName, moduleCode) {
    const cleanName = (studentName || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanMod = (moduleCode || 'QUIZ').replace(/[^a-zA-Z0-9_-]/g, '_');
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(d.getHours()).padStart(2, '0')}-${String(d.getMinutes()).padStart(2, '0')}`;
    return `STUDENT_${cleanName}_${cleanMod}_${dateStr}_${timeStr}.txt`;
  },

  /**
   * Triggers a direct browser file download using Blob
   */
  downloadFile(fileName, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  /**
   * Generates a combined Master TXT file of all student records for the Administrator
   */
  generateMasterExport(records) {
    const divider = '='.repeat(90);
    let lines = [];
    lines.push(divider);
    lines.push('                   WELCOMEPLACE CANADA - MASTER ADMIN AUDIT LOG');
    lines.push(`                   Total Student Attempts Logged: ${records.length}`);
    lines.push(`                   Export Date: ${new Date().toLocaleString('en-CA')}`);
    lines.push(divider);
    lines.push('');

    records.forEach((rec, idx) => {
      lines.push(`[RECORD #${idx + 1}]`);
      lines.push(`Student: ${rec.studentName} | Module: ${rec.moduleTitle} (${rec.moduleId})`);
      lines.push(`Date: ${new Date(rec.timestamp).toLocaleString()} | Score: ${rec.scorePercent}% (${rec.correctCount}/${rec.totalQuestions}) | Status: ${rec.status}`);
      lines.push('-'.repeat(60));
    });

    lines.push('');
    lines.push(divider);
    lines.push('WelcomePlace Canada Offline Platform');
    lines.push('End of Master Export.');
    return lines.join('\r\n');
  },

  /**
   * Generates a complete all-time historical TXT audit report for a specific student
   */
  generateStudentLifetimeReport(studentName, records) {
    const divider = '='.repeat(85);
    const subDivider = '-'.repeat(85);
    const dateStr = new Date().toLocaleString('en-CA');
    const totalAttempts = records.length;
    const avgScore = totalAttempts > 0 
      ? Math.round(records.reduce((sum, r) => sum + (r.scorePercent || 0), 0) / totalAttempts)
      : 0;
    const passedCount = records.filter(r => (r.scorePercent || 0) >= 70).length;

    let lines = [];
    lines.push(divider);
    lines.push('             WELCOMEPLACE CANADA - ALL-TIME LIFETIME STUDENT AUDIT REPORT');
    lines.push('                   Basic Computer Literacy Program for Immigrants');
    lines.push(divider);
    lines.push(`Learner Profile     : ${studentName}`);
    lines.push(`Total Attempts      : ${totalAttempts} completed test(s) & practice lab(s)`);
    lines.push(`Overall Average     : ${avgScore}%`);
    lines.push(`Successful Passes   : ${passedCount} of ${totalAttempts} (≥70%)`);
    lines.push(`Report Generated    : ${dateStr}`);
    lines.push(divider);
    lines.push('');
    lines.push('CHRONOLOGICAL EVALUATION HISTORY (ALL TIME):');
    lines.push(subDivider);

    if (totalAttempts === 0) {
      lines.push('No tests or practice labs recorded yet for this student.');
    } else {
      records.forEach((rec, idx) => {
        const attemptDate = new Date(rec.timestamp).toLocaleString('en-CA');
        const durationMin = Math.floor((rec.durationSeconds || 0) / 60);
        const durationSec = (rec.durationSeconds || 0) % 60;
        lines.push(`[ATTEMPT #${idx + 1}] - ${rec.moduleTitle} [${rec.moduleId || rec.moduleCode || 'MOD'}]`);
        lines.push(`  Date & Time : ${attemptDate}`);
        lines.push(`  Score       : ${rec.scorePercent}% (${rec.correctCount}/${rec.totalQuestions}) | Result: ${rec.status || 'COMPLETED'}`);
        lines.push(`  Time Spent  : ${durationMin}m ${durationSec}s`);
        
        if (Array.isArray(rec.details) && rec.details.length > 0) {
          lines.push('  Question / Skill Breakdown:');
          rec.details.forEach((det, dIdx) => {
            let ans = det.userAnswer;
            if (Array.isArray(ans)) ans = ans.join(', ');
            lines.push(`    • Item ${dIdx + 1}: ${det.prompt || 'Item'}`);
            lines.push(`      Learner Answer: ${ans || '[No answer]'} --> ${det.isCorrect ? 'CORRECT [✓]' : 'INCORRECT [✗]'}`);
            if (det.explanation) {
              lines.push(`      Note: ${det.explanation}`);
            }
          });
        }
        lines.push('');
      });
    }

    lines.push(subDivider);
    lines.push('DEVELOPMENT & AUDIT CERTIFICATION:');
    lines.push('Platform  : WelcomePlace Canada (Offline Front-end Mode)');
    lines.push('Program   : Basic Computer Literacy for Immigrants');
    lines.push('File type : Complete Lifetime Metrics Archive (UTF-8 Plain Text)');
    lines.push(divider);
    return lines.join('\r\n');
  },

  /**
   * Generates a safe file name for a student's complete lifetime metrics file
   */
  generateStudentLifetimeFileName(studentName) {
    const cleanName = (studentName || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return `ALL_TIME_METRICS_${cleanName}_${dateStr}.txt`;
  }
};

if (typeof window !== 'undefined') {
  window.TxtReportGenerator = TxtReportGenerator;
}
