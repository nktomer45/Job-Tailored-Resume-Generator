
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function generateTailoredResume(
  originalResume: string,
  jobDescription: string,
  careerStartDate?: string
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-preview-04-17';

  let contextualInfo = "";
  let yearsOfExperienceString = "Not specified";

  if (careerStartDate && careerStartDate.trim() !== "") {
    const currentYear = new Date().getFullYear();
    let startYear = parseInt(careerStartDate.trim()); // Default assumption

    // Try to parse year from MM/YYYY or YYYY format
    const careerStartDateCleaned = careerStartDate.trim();
    if (careerStartDateCleaned.includes('/')) {
      const parts = careerStartDateCleaned.split('/');
      if (parts.length === 2) {
        const yearPart = parseInt(parts[1]);
        if (!isNaN(yearPart) && yearPart.toString().length === 4) {
          startYear = yearPart;
        } else {
          startYear = NaN; // Invalid year part
        }
      } else {
        startYear = NaN; // Invalid format if more than one '/'
      }
    } else if (careerStartDateCleaned.length === 4 && !isNaN(startYear)) {
      // Already parsed as YYYY, ensure it's a number
    } else {
      startYear = NaN; // Not a 4-digit year, nor MM/YYYY
    }

    if (!isNaN(startYear) && startYear > 1900 && startYear <= currentYear) {
      const calculatedYears = currentYear - startYear;
      yearsOfExperienceString = `${calculatedYears} year${calculatedYears !== 1 ? 's' : ''} (approx.)`;
    } else {
        yearsOfExperienceString = `(Could not reliably calculate years of experience from input: '${careerStartDate}')`;
    }
    contextualInfo += `*   **Career Start Date Provided:** ${careerStartDateCleaned}\n`;
    contextualInfo += `*   **Approximate Years of Experience:** ${yearsOfExperienceString}\n`;
  } else {
    contextualInfo += `*   **Career Start Date:** Not provided.\n`;
    contextualInfo += `*   **Approximate Years of Experience:** Not applicable (no start date provided).\n`;
  }


  const prompt = `
You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist AI.
Your mission is to transform an "Original Resume" into a "Tailored Resume" that is:
1.  Specifically targeted to a given "Job Description".
2.  Highly effective and professional.
3.  Optimized to achieve a high pass rate (aiming for 70%+) with modern Applicant Tracking Systems.

**Overall Goal:** Create a compelling, ATS-friendly resume that maximizes the candidate's chances of getting an interview.

**Contextual Information (Use this to shape the narrative):**
${contextualInfo}

**Detailed Guidelines:**

**I. ATS Optimization (CRITICAL FOR SUCCESS):**
    1.  **Keyword Congruence:**
        *   Identify and strategically integrate essential keywords, skills, and phrases from the "Job Description" throughout the "Tailored Resume".
        *   Keywords should appear naturally within the context of achievements and responsibilities. Avoid keyword stuffing.
    2.  **Standard Formatting for Parsability:**
        *   Use clear, common section headings (e.g., "Professional Experience", "Education", "Skills", "Projects", "Summary", "Objective"). Capitalize them consistently.
        *   Employ standard bullet points (e.g., '-', '*', '•').
        *   Avoid tables, columns, text boxes, images, headers/footers (in the textual sense), and special characters/symbols that ATS might struggle to parse. Stick to a single-column text layout.
        *   Use common, readable fonts (though this is a text-only output, the structure should imply this).
    3.  **Order and Flow:**
        *   Use reverse-chronological order for "Professional Experience" and "Education" sections (most recent first).
    4.  **Contact Information:** Ensure contact information (if present in the original) is clear, complete (Name, Phone, Email, LinkedIn if available), and easy for ATS to parse. Place it at the top.
    5.  **File Type Implication:** While you generate text, it should be suitable for saving as a .txt or .docx file, which are generally ATS-friendly.

**II. Content Tailoring and Enhancement (Primary Objective):**
    1.  **Job Description Alignment:** Your foremost goal is to adapt the "Original Resume" to highlight the candidate's skills, experiences, and achievements that are most relevant to the "Job Description".
    2.  **Impactful Bullet Points (Professional Experience & Projects):**
        *   Start each bullet point with a strong action verb.
        *   Quantify achievements whenever possible (e.g., "Increased sales by 15%," "Managed a team of 5," "Reduced project costs by $10k by implementing X"). Use the C.A.R. (Challenge, Action, Result) or S.T.A.R. (Situation, Task, Action, Result) method implicitly to frame accomplishments.
    3.  **Relevance and Conciseness:**
        *   Focus on the most relevant information for the target role. Remove or significantly condense experiences or skills from the "Original Resume" that are not pertinent.
        *   Aim for clarity and brevity. Resumes are often scanned quickly.
    4.  **Skills Section:**
        *   Create a dedicated "Skills" section.
        *   Populate it with technical skills, software proficiency, tools, languages, and relevant soft skills, directly aligning with those mentioned in the "Job Description" and present in the original resume.
        *   Categorize skills if appropriate and logical (e.g., "Programming Languages:", "Databases:", "Cloud Platforms:", "Methodologies:").
    5.  **Professional Summary/Objective (Highly Recommended for ATS & Impact):**
        *   Create a concise (3-4 lines) "Professional Summary" at the top of the resume, directly below the contact information.
        *   This summary should immediately grab the recruiter's attention and state the candidate's value proposition for the specific role.
        *   It must be tailored to the "Job Description", highlighting years of experience (if calculated), key skills, and career objectives relevant to the target job.
    6.  **Accuracy and Truthfulness:** The tailored resume must remain a truthful representation. Do not invent skills or experiences not derivable from the "Original Resume".
    7.  **Career Stage Adaptation:** Use the "Approximate Years of Experience" to adjust the tone and emphasis:
        *   *Entry-level/Early Career (0-3 years):* Focus on potential, academic achievements, relevant projects, internships, and foundational skills. Emphasize eagerness to learn and contribute.
        *   *Mid-Career (4-10 years):* Showcase growth, specific accomplishments, increasing responsibility, problem-solving skills, and developed expertise.
        *   *Senior/Experienced (10+ years):* Emphasize leadership, strategic impact, significant achievements, mentorship, and deep expertise.

**III. Formatting Style Preservation (Secondary, applied to TAILORED & ATS-OPTIMIZED content):**
    1.  **Maintain Original's Spirit (Textually):** While prioritizing ATS compatibility, strive to retain the *spirit* of the original resume's textual structure and style if it doesn't conflict with ATS best practices (e.g., if the original used all caps for headings, continue this if the headings are standard).
    2.  **Bullet Point Characters:** If the original uses standard characters like '-', '*', or '•', try to use the same. Default to '*' or '•' if unclear.
    3.  **Indentation and Spacing:** Maintain consistent textual layout, ensuring readability with clear separation between sections and entries.

**Crucial Instructions:**
*   **Do NOT return the Original Resume unchanged.** The output MUST reflect substantive modifications for ATS optimization and job description alignment.
*   **ATS Score Target:** Structure and write the content with the objective that it would perform exceptionally well in an ATS, aiming for a high compatibility/pass rate (e.g., 70% or more).
*   **Output ONLY the tailored resume text.** No introductory/concluding remarks, explanations, or markdown fences unless they are part of the resume content itself.

**Inputs:**

**Original Resume:**
\`\`\`
${originalResume}
\`\`\`

**Job Description:**
\`\`\`
${jobDescription}
\`\`\`

**Task:**
Generate the ATS-optimized, job-tailored resume.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from the AI.");
    }
    let processedText = text.trim();
    const markdownFenceRegex = /^```(?:\w*\n)?([\s\S]*?)\n?```$/;
    const match = processedText.match(markdownFenceRegex);
    if (match && match[1]) {
        processedText = match[1].trim();
    }
    return processedText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("Invalid API Key. Please check your configuration.");
        }
         throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
}
